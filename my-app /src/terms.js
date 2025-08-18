import React from "react";
import "./terms.css"
const Terms = () => {
  return (
    <div className="terms-page">
      <h1>Terms and Conditions</h1>
      <p>By signing up, you agree to the following terms:</p>
      <ul>
        <li>You are responsible for maintaining the confidentiality of your account.</li>
        <li>We may collect and use your data to improve our services.</li>
        <li>You must not use this platform for any illegal activities.</li>
        <li>We reserve the right to terminate your account if you violate these terms.</li>
        <li>You must be at least 13 years old to create an account. If you are under 18, you must have parental or guardian consent.</li>
        <li>All content on this platform is protected by intellectual property laws, and you may not reproduce or distribute it without permission.</li>
        <li>We are not liable for any indirect, incidental, or consequential damages arising from your use of this platform.</li>
        <li>We may modify these terms at any time, and your continued use of the platform constitutes acceptance of the revised terms.</li>
        <li>These terms are governed by the laws of [Your Country/State], and any disputes will be resolved in the courts of [Your Country/State].</li>
      </ul>
    </div>
  );
};

export default Terms;
