export async function fetchProducts() {
  try {
    const res = await fetch('/products.json');
    if (!res.ok) throw new Error('Failed to fetch Shopify products');
    const data = await res.json();
    
    return data.products.map(product => {
      // Find color options if any
      const colorOption = product.options ? product.options.find(opt => opt.name.toLowerCase() === 'color') : null;
      const colorCount = colorOption ? colorOption.values.length : 0;
      const colorValues = colorOption ? colorOption.values : [];
      
      // Get primary and secondary images
      const primaryImage = product.images && product.images.length > 0 ? product.images[0].src : '';
      const secondaryImage = product.images && product.images.length > 1 ? product.images[1].src : '';
      const allImages = product.images ? product.images.map(img => img.src) : [];
      
      // Get pricing info
      const price = parseFloat(product.variants[0].price);
      // If Shopify has no compare_at_price set, fabricate MRP = price + ₹300
      // so all products show a crossed-out original price and discount %
      let compareAtPrice = product.variants[0].compare_at_price
        ? parseFloat(product.variants[0].compare_at_price)
        : price + 300;

      // Calculate discount percentage (integer)
      let discountPercent = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
      
      return {
        id: product.variants[0].id.toString(),
        handle: product.handle,
        name: product.title,
        price: price,
        compareAtPrice: compareAtPrice,
        discountPercent: discountPercent,
        image: primaryImage,
        secondaryImage: secondaryImage,
        images: allImages,
        status: product.variants[0].available ? 'IN_STOCK' : 'SOLD_OUT',
        type: product.product_type || 'APPAREL',
        hasVariants: product.variants.length > 1,
        colorCount: colorCount,
        colorValues: colorValues
      };
    });
  } catch (error) {
    console.error('Shopify fetch error:', error);
    return [];
  }
}

export async function fetchProduct(handle) {
  try {
    // Use /products.json?handle= so we get full image objects with alt text.
    // The /products/{handle}.js endpoint only returns image URLs as plain strings —
    // no alt text available there, which we need for the color gallery feature.
    const res = await fetch(`/products/${handle}.json`);
    if (!res.ok) throw new Error('Failed to fetch Shopify product');
    const data = await res.json();
    const product = data.product;
    if (!product) return null;

    // /products.json returns prices as INR decimal strings ("1400.00") — no /100 needed.
    const price = parseFloat(product.variants[0].price);
    let compareAtPrice = product.variants[0].compare_at_price
      ? parseFloat(product.variants[0].compare_at_price)
      : price + 300;
    let discountPercent = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);

    // Normalise any image src to a full https:// URL
    const toHttps = src => (src && !src.startsWith('http')) ? 'https:' + src : src;

    // Keep both src and alt for the color-map builder step below
    const imageObjs = product.images
      ? product.images.map(img => ({ src: toHttps(img.src), alt: img.alt || '' }))
      : [];

    // ── Color → Images map (alt-text based) ───────────────────────────────────
    //
    // Convention agreed with the store owner:
    //   Shopify image alt text follows the pattern:  productname_colorslug_view
    //   e.g.  "face_black_front"         → color "Black"
    //         "face_navy_blue_front"     → color "Navy Blue"
    //         "hoodie_acid_grey_back"    → color "Acid Grey"
    //
    // Algorithm:
    //   1. For every Color option value, compute its slug:
    //        "Navy Blue" → "navy_blue"  (lowercase, spaces/hyphens → underscore)
    //   2. For every image, compute the alt slug the same way.
    //   3. If the alt slug CONTAINS the color slug → add to that color's list.
    //   4. Fallback in UI: if a color has zero matched images, show all images.
    // ─────────────────────────────────────────────────────────────────────────
    const colorOptionIdx = product.options
      ? product.options.findIndex(o => o.name.toLowerCase() === 'color')
      : -1;

    const colorImageMap = {};
    if (colorOptionIdx >= 0) {
      const colorValues = product.options[colorOptionIdx].values;

      imageObjs.forEach(({ src, alt }) => {
        // Normalise alt: lowercase, collapse spaces and hyphens to underscores
        const altSlug = alt.toLowerCase().replace(/[\s\-]+/g, '_');

        colorValues.forEach(color => {
          // "Navy Blue" → "navy_blue"
          const colorSlug = color.toLowerCase().replace(/[\s\-]+/g, '_');

          if (altSlug.includes(colorSlug)) {
            if (!colorImageMap[color]) colorImageMap[color] = [];
            if (!colorImageMap[color].includes(src)) {
              colorImageMap[color].push(src);
            }
          }
        });
      });
    }

    return {
      id: product.variants[0].id.toString(),
      handle: product.handle,
      name: product.title,
      price,
      compareAtPrice,
      discountPercent,
      // Flat list of all image URLs — used as fallback when no color images match
      images: imageObjs.map(i => i.src),
      description: product.body_html || '',
      status: product.variants[0].available ? 'IN_STOCK' : 'SOLD_OUT',
      type: product.product_type || 'APPAREL',
      options: product.options || [],
      // color name → [image URLs], built from alt text.  Empty {} if no Color option.
      colorImageMap,
      // 1-based index of the Color option (-1 if product has no Color option)
      colorOptionIdx: colorOptionIdx >= 0 ? colorOptionIdx + 1 : -1,
      variants: product.variants.map(v => {
        const vPrice = parseFloat(v.price);
        let vCompareAt = v.compare_at_price
          ? parseFloat(v.compare_at_price)
          : vPrice + 300;
        let vDiscount = Math.round(((vCompareAt - vPrice) / vCompareAt) * 100);
        return {
          id: v.id.toString(),
          title: v.title,
          price: vPrice,
          compareAtPrice: vCompareAt,
          discountPercent: vDiscount,
          available: v.available,
          options: product.options.map((opt, index) => v[`option${index + 1}`]),
          featured_image: v.featured_image ? toHttps(v.featured_image.src) : null
        };
      })
    };
  } catch (error) {
    console.error('Shopify fetch product error:', error);
    return null;
  }
}

export async function addToCart(variantId, quantity = 1) {
  try {
    const res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{
          id: parseInt(variantId),
          quantity: quantity
        }]
      })
    });
    if (!res.ok) throw new Error('Failed to add to cart');
    return await res.json();
  } catch (error) {
    console.error('Shopify add to cart error:', error);
    throw error;
  }
}
