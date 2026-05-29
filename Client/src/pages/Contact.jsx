import React from 'react';
import '../styles/Contact.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  return (
    <section id='contact' className="contact-us-container">
      <div className="contact-wrapper">
        {/* Left Side: Contact Information */}
        <div className="contact-info-column">
          <h2 className="info-main-heading">Contact Information</h2>
          <p className="info-description">
            Feel free to reach out to us for any legal queries or assistance. Our team is ready to help you.
          </p>
          <div className="contact-details">
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <p>+92 XXX XXXXXXX</p>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <p>info@voiceoflaw.com</p>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <p>123, Chiniot, Punjab, Pakistan</p>
            </div>
          </div>
        </div>

        {/* Right Side: Message Form */}
        <div className="message-form-column">
          <h2 className="form-main-heading">Send us a Message</h2>
          <p className="form-description">
            We'd love to hear from you! Please fill out the form below and we'll get back to you shortly.
          </p>
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" name="name" placeholder="Enter your full name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input type="email" id="email" name="email" placeholder="Enter your email address" required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number (Optional)</label>
              <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="6" placeholder="Type your message here..." required></textarea>
            </div>
            <button type="submit" className="send-message-btn">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;