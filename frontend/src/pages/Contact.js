// frontend/src/pages/Contact.js

import React, { useState, useEffect } from 'react';
import '../App.css';
import { apiUrl } from '../lib/api';
import { setPageMeta } from '../lib/meta';

const Contact = () => {
    // State for form fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    // State for submission status
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        setPageMeta('Fenet Cafe | Contact', 'Contact Fenet Cafe for reservations, catering, or questions.');
    }, []);

    const validate = (values) => {
        const errors = {};
        const name = (values.name || '').trim();
        const email = (values.email || '').trim();
        const message = (values.message || '').trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name) {
            errors.name = 'Please enter your name.';
        } else if (name.length < 2 || name.length > 80) {
            errors.name = 'Name must be between 2 and 80 characters.';
        } else if (/\d/.test(name)) {
            errors.name = 'Name cannot contain numbers.';
        }

        if (!email) {
            errors.email = 'Please enter your email address.';
        } else if (email.length > 254 || !emailPattern.test(email)) {
            errors.email = 'Please enter a valid email address.';
        }

        if (!message) {
            errors.message = 'Please enter a message.';
        } else if (message.length < 10 || message.length > 2000) {
            errors.message = 'Message must be between 10 and 2000 characters.';
        }

        return errors;
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
        if (submitError) {
            setSubmitError('');
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        const errors = validate(formData);
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setSubmitError('Please correct the highlighted fields.');
            return;
        }

        try {
            setIsSubmitting(true);
            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                message: formData.message.trim()
            };
            const response = await fetch(apiUrl('/api/contact'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || 'Failed to send message. Please try again.');
            }

            setIsSubmitted(true);
            setFieldErrors({});
            setFormData({ name: '', email: '', message: '' });

            setTimeout(() => {
                setIsSubmitted(false);
            }, 5000);
        } catch (err) {
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="contact-page">
            <h1>Get in Touch with Fenet Cafe</h1>

            <div className="contact-grid">
                {/* --- Contact Info --- */}
                <div className="contact-info">
                    <h2>Location & Hours</h2>
                    <p><strong>Address:</strong> Gelan Sub city, Oromia, Ethiopia</p>
                    <p><strong>Phone:</strong> +251 989977058</p>
                    <p><strong>Hours:</strong> Mon - Sat: 7:00 AM - 9:00 PM</p>
                    <p><strong>Sunday:</strong> 9:00 AM - 5:00 PM</p>

                    {/* --- EMBEDDED MAP CODE (Replaces map-placeholder) --- */}
                    <div className="map-container">
                        {/* The Google Maps iframe will render the interactive map */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15764.12061245082!2d38.86819445!3d8.81430035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b8543d83d9519%3A0xc63a10523d4844ce!2sGelan%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1700947761000!5m2!1sen!2sus"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Fenet Cafe Location Map in Gelan, Oromia"
                        ></iframe>
                    </div>
                </div>

                {/* --- Contact Form --- */}
                <div className="contact-form-container">
                    <h2>Send Us a Message</h2>

                    {isSubmitted && (
                        <p className="success-message">
                            Thank you for your message! We will be in touch soon.
                        </p>
                    )}
                    {submitError && (
                        <p className="error-message">
                            {submitError}
                        </p>
                    )}

                    <form className="contact-form" onSubmit={handleSubmit} noValidate>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={fieldErrors.name ? 'input-error' : ''}
                            aria-invalid={fieldErrors.name ? 'true' : 'false'}
                            aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                            minLength={2}
                            maxLength={80}
                            required
                        />
                        {fieldErrors.name && <p className="field-error" id="name-error">{fieldErrors.name}</p>}

                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={fieldErrors.email ? 'input-error' : ''}
                            aria-invalid={fieldErrors.email ? 'true' : 'false'}
                            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                            maxLength={254}
                            required
                        />
                        {fieldErrors.email && <p className="field-error" id="email-error">{fieldErrors.email}</p>}

                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            className={fieldErrors.message ? 'input-error' : ''}
                            aria-invalid={fieldErrors.message ? 'true' : 'false'}
                            aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                            minLength={10}
                            maxLength={2000}
                            required
                        />
                        {fieldErrors.message && <p className="field-error" id="message-error">{fieldErrors.message}</p>}

                        <button type="submit" className="submit-button" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
