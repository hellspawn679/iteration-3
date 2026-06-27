/**
 * Resize a Shopify CDN image URL by inserting a size suffix (e.g. _600x)
 * before the file extension. Falls back to original URL if parsing fails.
 * @param {string} url  - Original Shopify CDN image URL
 * @param {string} size - Size suffix, e.g. '600x' or '300x300'
 */
function resizeShopifyImage(url, size = '600x') {
  if (!url) return url;
  try {
    const match = url.match(/^(.*\/[^?#]+?)(\.(jpg|jpeg|png|gif|webp|avif))(.*)$/i);
    if (match) {
      return `${match[1]}_${size}${match[2]}${match[4]}`;
    }
  } catch (e) { /* fall through */ }
  return url;
}

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
      
      // Get primary and secondary images — resized for product card grid
      const primaryImage = product.images && product.images.length > 0 ? resizeShopifyImage(product.images[0].src) : '';
      const secondaryImage = product.images && product.images.length > 1 ? resizeShopifyImage(product.images[1].src) : '';
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
    // Fetch both the AJAX .js API (contains availability status) and the .json API (contains image alt text)
    const [jsRes, jsonRes] = await Promise.all([
      fetch(`/products/${handle}.js`).catch(() => null),
      fetch(`/products/${handle}.json`).catch(() => null)
    ]);

    if (!jsonRes || !jsonRes.ok) throw new Error('Failed to fetch Shopify product JSON');
    const jsonData = await jsonRes.json();
    const product = jsonData.product;
    if (!product) return null;

    // Try parsing the AJAX data for availability mapping
    let jsData = null;
    if (jsRes && jsRes.ok) {
      try {
        jsData = await jsRes.json();
      } catch (e) {
        console.warn('Failed to parse Shopify AJAX JS data:', e);
      }
    }

    // Map availability status from the AJAX endpoint into the variants
    if (jsData && jsData.variants) {
      product.available = jsData.available;
      product.variants.forEach(v => {
        const jsVariant = jsData.variants.find(jsV => jsV.id.toString() === v.id.toString());
        v.available = jsVariant ? jsVariant.available : true;
      });
    } else {
      product.available = true;
      product.variants.forEach(v => {
        v.available = true;
      });
    }

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
    console.log(`[shopify.js:fetchProduct] Product: "${product.title}" (${handle})`);
    console.log(`[shopify.js:fetchProduct] Total images: ${imageObjs.length}`);
    imageObjs.forEach((img, idx) => {
      console.log(`  - Image ${idx + 1}: src="${img.src}" | alt="${img.alt}"`);
    });

    const colorOptionIdx = product.options
      ? product.options.findIndex(o => o.name.toLowerCase() === 'color')
      : -1;

    const colorImageMap = {};
    if (colorOptionIdx >= 0) {
      const colorValues = product.options[colorOptionIdx].values;
      console.log(`[shopify.js:fetchProduct] Color options found:`, colorValues);

      imageObjs.forEach(({ src, alt }) => {
        // Extract filename from URL to inspect as fallback
        const urlPath = src.split('?')[0];
        const filename = urlPath.substring(urlPath.lastIndexOf('/') + 1);

        // Normalise alt and filename: lowercase, collapse spaces, hyphens, and underscores
        const altSlug = alt.toLowerCase().replace(/[\s\-\_]+/g, '_');
        const filenameSlug = filename.toLowerCase().replace(/[\s\-\_]+/g, '_');

        colorValues.forEach(color => {
          // Normalize color name to slug: "Navy Blue" -> "navy_blue"
          const colorSlug = color.toLowerCase().replace(/[\s\-\_]+/g, '_');

          // Match if color slug is found in either alt text or the image filename
          if (altSlug.includes(colorSlug) || filenameSlug.includes(colorSlug)) {
            if (!colorImageMap[color]) colorImageMap[color] = [];
            if (!colorImageMap[color].includes(src)) {
              colorImageMap[color].push(src);
            }
          }
        });
      });
      console.log(`[shopify.js:fetchProduct] Resulting colorImageMap:`, colorImageMap);
    } else {
      console.log(`[shopify.js:fetchProduct] No Color option found for this product.`);
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

export async function fetchCollectionProducts(collectionHandle) {
  try {
    const res = await fetch(`/collections/${collectionHandle}/products.json`);
    if (!res.ok) throw new Error(`Failed to fetch Shopify collection products for: ${collectionHandle}`);
    const data = await res.json();
    
    return data.products.map(product => {
      const colorOption = product.options ? product.options.find(opt => opt.name.toLowerCase() === 'color') : null;
      const colorCount = colorOption ? colorOption.values.length : 0;
      const colorValues = colorOption ? colorOption.values : [];
      
      const primaryImage = product.images && product.images.length > 0 ? resizeShopifyImage(product.images[0].src) : '';
      const secondaryImage = product.images && product.images.length > 1 ? resizeShopifyImage(product.images[1].src) : '';
      const allImages = product.images ? product.images.map(img => img.src) : [];
      
      const price = parseFloat(product.variants[0].price);
      let compareAtPrice = product.variants[0].compare_at_price
        ? parseFloat(product.variants[0].compare_at_price)
        : price + 300;

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
    console.error(`Shopify fetch collection products error (${collectionHandle}):`, error);
    return [];
  }
}

let collectionsPromise = null;

export function fetchCollections() {
  if (!collectionsPromise) {
    collectionsPromise = (async () => {
      try {
        const res = await fetch('/collections.json');
        if (!res.ok) throw new Error('Failed to fetch Shopify collections');
        const data = await res.json();
        
        // Filter out collections with 0 products or template collections
        const filteredCollections = data.collections.filter(col => {
          if (col.products_count === 0) return false;
          const handle = col.handle.toLowerCase();
          if (handle === 'frontpage' || handle === 'all' || handle.includes('asset-pack') || handle.includes('example')) {
            return false;
          }
          return true;
        });

        // Prioritize showing product mockup images inside each collection bubble (dynamic looping slideshow)
        const collectionPromises = filteredCollections.map(async (col) => {
          let imageSrcs = [];
          
          try {
            const prodRes = await fetch(`/collections/${col.handle}/products.json`);
            if (prodRes.ok) {
              const prodData = await prodRes.json();
              if (prodData.products && prodData.products.length > 0) {
                // Get up to 4 products and extract their primary mockups
                prodData.products.slice(0, 4).forEach(prod => {
                  if (prod.images && prod.images.length > 0) {
                    let src = prod.images[0].src;
                    if (!src.startsWith('http')) {
                      src = 'https:' + src;
                    }
                    src = resizeShopifyImage(src, '200x');
                    if (!imageSrcs.includes(src)) {
                      imageSrcs.push(src);
                    }
                  }
                });
              }
            }
          } catch (err) {
            console.error(`Error fetching product images for collection ${col.handle}:`, err);
          }

          // Fallback to explicit collection image if no product images were resolved
          if (imageSrcs.length === 0 && col.image) {
            let src = col.image.src;
            if (!src.startsWith('http')) {
              src = 'https:' + src;
            }
            src = resizeShopifyImage(src, '200x');
            imageSrcs.push(src);
          }

          return {
            id: col.id.toString(),
            title: col.title,
            handle: col.handle,
            image: imageSrcs[0] || '', // Fallback single image for general use
            images: imageSrcs, // Slideshow array of product mockups
            productsCount: col.products_count
          };
        });

        return await Promise.all(collectionPromises);
      } catch (error) {
        console.error('Shopify fetch collections error:', error);
        collectionsPromise = null; // Reset cache on failure to allow retry
        return [];
      }
    })();
  }
  return collectionsPromise;
}

