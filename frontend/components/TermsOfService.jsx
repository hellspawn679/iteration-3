import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './PolicyPage.css';

const TermsOfService = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy-page">
      <div className="container">
        <button className="policy-page__back" onClick={() => navigate('/')}>
          <ChevronLeft size={14} />
          <span>Back to Home</span>
        </button>

        <div className="policy-content">
          <h1 className="policy-content__title">Terms of Service</h1>
          <p className="policy-content__updated">Last updated: June 2025</p>

          <p>
            Please read these Terms of Service ("<strong>Terms</strong>") carefully before using the DARTH website and placing an order. By accessing our store or making a purchase, you agree to be bound by these Terms.
          </p>

          <h2>1. General</h2>
          <p>
            These Terms apply to all visitors, users, and customers of DARTH. We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the site constitutes acceptance of any changes.
          </p>

          <h2>2. Products</h2>
          <ul>
            <li>All products are made-to-order through our print-on-demand fulfillment partner, Qikink.</li>
            <li>Product colours may appear slightly different on screen due to monitor calibration and print processes.</li>
            <li>We reserve the right to discontinue any product at any time.</li>
            <li>Prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.</li>
          </ul>

          <h2>3. Orders &amp; Payment</h2>
          <ul>
            <li>By placing an order, you confirm that all information provided is accurate and complete.</li>
            <li>We accept payments via Shopify Payments, Razorpay (UPI, Net Banking, Cards), and Cash on Delivery (where available).</li>
            <li>Orders are confirmed only upon successful payment. We reserve the right to cancel any order at our discretion, in which case a full refund will be issued.</li>
            <li>We are not responsible for payment failures due to your bank or payment gateway.</li>
          </ul>

          <h2>4. Pricing &amp; Taxes</h2>
          <p>
            All prices displayed are in INR (₹) and include applicable GST unless stated otherwise. Shipping charges (if any) are calculated at checkout and are not included in the product price.
          </p>

          <h2>5. Shipping &amp; Delivery</h2>
          <ul>
            <li>We ship across India via our fulfillment partner Qikink, using courier services such as Delhivery, BlueDart, Xpressbees, and India Post.</li>
            <li>Estimated delivery time is <strong>3–7 business days</strong> from the date of dispatch. Production time (1–3 business days) is additional to this.</li>
            <li>We are not liable for delays caused by courier partners, natural events, or incorrect addresses provided by the customer.</li>
            <li>Ensure your shipping address and PIN code are correct at the time of order. DARTH is not responsible for failed deliveries due to incorrect address details.</li>
          </ul>

          <h2>6. Returns, Exchanges &amp; Refunds</h2>
          <ul>
            <li>Since all products are <strong>made-to-order</strong>, we do not accept returns or exchanges for reasons of wrong size selection or change of mind.</li>
            <li>We will accept returns or issue a replacement/refund only in cases of:
              <ul>
                <li>Defective or damaged products upon delivery.</li>
                <li>Incorrect item shipped (wrong product or print).</li>
              </ul>
            </li>
            <li>Claims must be raised within <strong>48 hours</strong> of delivery with clear photos of the product and packaging sent to <a href="mailto:hello@darth.store">hello@darth.store</a>.</li>
            <li>Approved refunds will be processed to the original payment method within <strong>5–10 business days</strong>.</li>
            <li>COD orders are eligible for store credit or exchange only, not cash refunds.</li>
          </ul>

          <h2>7. Intellectual Property</h2>
          <p>
            All content on this website — including logos, designs, graphics, product images, and text — is the intellectual property of DARTH and may not be reproduced, distributed, or used without our express written permission.
          </p>

          <h2>8. Prohibited Uses</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use our store for any unlawful purpose or in violation of these Terms.</li>
            <li>Attempt to gain unauthorised access to any part of our systems.</li>
            <li>Submit false or fraudulent orders.</li>
            <li>Copy, reproduce, or use our designs without permission.</li>
          </ul>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, DARTH shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of our store or products, even if we have been advised of the possibility of such damages. Our total liability to you for any claim shall not exceed the amount you paid for the relevant order.
          </p>

          <h2>10. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts located in Rajasthan, India.
          </p>

          <h2>11. Contact Us</h2>
          <p>For any questions regarding these Terms, please reach out to us:</p>
          <ul>
            <li>Email: <a href="mailto:hello@darth.store">hello@darth.store</a></li>
            <li>Hours: Monday – Saturday, 10am – 6pm IST</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
