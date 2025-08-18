import React from "react";
import "./permissions.css"
const Permissions = () => {
  return (
    <div className="permissions-page">
      <h1>Permissions</h1>
      <p>By signing up, you grant us permission to:</p>
      <ul>
        <li>Collect and store your personal information (e.g., name, email, role) to create and manage your account.</li>
        <li>Use your data to provide and improve our services.</li>
        <li>Send you emails related to your account and our services.</li>
        <li>Monitor your use of the platform to ensure compliance with these terms.</li>
        <li>Share your data with trusted third-party service providers to facilitate platform operations.</li>
        <li>Use your data to enforce our policies and protect the rights and safety of our users and the platform.</li>
      </ul>
    </div>
  );
};

export default Permissions;
