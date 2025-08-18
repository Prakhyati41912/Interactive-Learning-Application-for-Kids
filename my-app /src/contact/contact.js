import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaLinkedin, FaGithub } from 'react-icons/fa';
import './contact.css';

const ContactPage = () => {
  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-subtitle">We'd love to hear from you!</p>
      
      <div className="contact-grid">
        {/* Contact Information */}
        <div className="contact-card">
          <div className="contact-icon">
            <FaPhone />
          </div>
          <h3>Phone</h3>
          <p>+1 (555) 123-4567</p>
          <p>Mon-Fri: 9am-5pm</p>
        </div>

        <div className="contact-card">
          <div className="contact-icon">
            <FaEnvelope />
          </div>
          <h3>Email</h3>
          <p>info@kidquest.com</p>
          <p>support@kidquest.com</p>
        </div>

        <div className="contact-card">
          <div className="contact-icon">
            <FaMapMarkerAlt />
          </div>
          <h3>Address</h3>
          <p>123 Education Street</p>
          <p>Tech City, TC 10001</p>
        </div>

        <div className="contact-card">
          <div className="contact-icon">
            <FaClock />
          </div>
          <h3>Hours</h3>
          <p>Monday-Friday: 9am-5pm</p>
          <p>Saturday: 10am-2pm</p>
          <p>Sunday: Closed</p>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="social-links">
        <h3>Connect With Us</h3>
        <div className="social-icons">
          <a href="https://linkedin.com/company/kidquest" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="social-icon" />
          </a>
          <a href="https://github.com/kidquest" target="_blank" rel="noopener noreferrer">
            <FaGithub className="social-icon" />
          </a>
        </div>
      </div>

      {/* Contact Form */}
      <div className="contact-form">
        <h3>Send Us a Message</h3>
        <form>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Your name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Your email" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" rows="5" placeholder="Your message" required></textarea>
          </div>
          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;