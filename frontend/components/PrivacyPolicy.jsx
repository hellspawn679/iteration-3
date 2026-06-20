import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './PolicyPage.css';

const PrivacyPolicy = () => {
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
          <h1 className="policy-content__title">Privacy Policy</h1>
          <p className="policy-content__updated">Last updated: June 2025</p>

          <p>
            At DARTH ("<strong>we</strong>", "<strong>us</strong>", or "<strong>our</strong>"), we are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit and make a purchase from our store.
          </p>

          <h2>1. Information We Collect</h2>
          <p>When you visit or make a purchase from DARTH, we collect certain information from you including:</p>
          <ul>
            <li><strong>Personal identification information:</strong> Name, email address, phone number, billing address, and shipping address.</li>
            <li><strong>Payment information:</strong> We do not store your payment card details. All payments are processed securely through Shopify Payments / Razorpay / other payment gateways.</li>
            <li><strong>Order information:</strong> Products purchased, order history, and transaction details.</li>
            <li><strong>Device &amp; usage data:</strong> IP address, browser type, pages visited, and referring URLs, collected automatically via cookies.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and fulfil your orders, including sending order confirmations and shipping updates.</li>
            <li>Communicate with you about your account or purchases.</li>
            <li>Send promotional communications if you have opted in (you can unsubscribe at any time).</li>
            <li>Improve and personalise your shopping experience.</li>
            <li>Prevent fraud and ensure platform security.</li>
            <li>Comply with applicable laws and regulations.</li>
          </ul>

          <h2>3. Sharing Your Information</h2>
          <p>We share your information only with trusted third parties who help us operate our store:</p>
          <ul>
            <li><strong>Shopify:</strong> Our e-commerce platform. Your data is stored on Shopify's secure servers. See <a href="https://www.shopify.com/legal/privacy" target="_blank" rel="noreferrer">Shopify's Privacy Policy</a>.</li>
            <li><strong>Qikink:</strong> Our print-on-demand and fulfilment partner who receives your shipping address and order details to produce and dispatch your order.</li>
            <li><strong>Payment processors:</strong> Razorpay / Shopify Payments for secure transaction handling.</li>
            <li><strong>Courier partners:</strong> Delhivery, BlueDart, Xpressbees, India Post — who receive your delivery address to ship your order.</li>
          </ul>
          <p>We do <strong>not</strong> sell, trade, or rent your personal information to third parties for marketing purposes.</p>

          <h2>4. Cookies</h2>
          <p>We use cookies to enhance your browsing experience, track sessions, and analyse site traffic. You can disable cookies in your browser settings, but doing so may affect some site functionality. By using our store, you consent to our use of cookies.</p>

          <h2>5. Data Retention</h2>
          <p>We retain your personal data for as long as necessary to fulfil the purposes outlined in this policy, and as required by applicable law (e.g., financial record-keeping obligations under Indian law).</p>

          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Request deletion of your personal data (subject to legal obligations).</li>
            <li>Opt out of marketing communications at any time.</li>
          </ul>
          <p>To exercise any of these rights, please contact us at <a href="mailto:hello@darth.store">hello@darth.store</a>.</p>

          <h2>7. Security</h2>
          <p>We take reasonable administrative, technical, and physical measures to protect your personal information. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.</p>

          <h2>8. Third-Party Links</h2>
          <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their policies before providing any personal information.</p>

          <h2>9. Children's Privacy</h2>
          <p>Our store is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.</p>

          <h2>10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically.</p>

          <h2>11. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <ul>
            <li>Email: <a href="mailto:hello@darth.store">hello@darth.store</a></li>
            <li>Hours: Monday – Saturday, 10am – 6pm IST</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
