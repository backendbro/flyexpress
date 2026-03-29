"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function ContactForm() {
  const [isSending, setIsSending] = useState(false);
  const supabase = createClient();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSending(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const data = {
      name: formData.get('name'),
      company: formData.get('company'),
      address: formData.get('address'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      comments: formData.get('comments'),
    };
    
    try {
      // Save to Supabase
      const { error: dbError } = await supabase
        .from('messages')
        .insert({
          name: data.name,
          email: data.email,
          company: data.company || null,
          phone: data.phone || null,
          message: data.comments || data.address || 'No message provided'
        })

      if (dbError) throw dbError

      // Send email notification (optional)
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'sales@firstflyexpress.com',
          subject: `New Contact Form Submission from ${data.name}`,
          message: `
            <h3>Contact Details:</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Company:</strong> ${data.company || 'N/A'}</p>
            <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Message:</strong> ${data.comments || data.address || 'N/A'}</p>
          `,
          fromName: data.name as string,
          fromEmail: data.email as string,
        }),
      });
      
      alert("Message sent successfully. Our team will respond within 24 hours.");
      form.reset();
    } catch (error) {
      console.error('Error:', error);
      alert("Failed to send message. Please try again or call us directly.");
    } finally {
      setIsSending(false);
    }
  }

  // Rest of your form JSX remains the same...
  return (
    <form onSubmit={onSubmit} className="contact-form-card p-6 md:p-8">
      {/* Your existing form fields */}
     <div className="text-center mb-6">
        <i className="fas fa-paper-plane text-red-500 text-3xl mb-2" />
        <h3 className="text-2xl font-bold text-gray-800">Send Us a Message</h3>
        <p className="text-gray-500 text-sm mt-1">
          For queries, jobs, or business partnerships
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-400 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <input
            type="text"
            name="company"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-400 outline-none"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <textarea
          name="address"
          rows={2}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-400 outline-none"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-400 outline-none"
          />
        </div>
      </div>
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comments / Questions
        </label>
        <textarea
          name="comments"
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-400 outline-none"
        />
      </div>
      <div className="flex gap-3 flex-wrap">
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-xl transition shadow-md flex-1"
        >
          <i className="fas fa-paper-plane mr-2" /> Send Information
        </button>
        <button
          type="reset"
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl transition"
        >
          Clear
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">
        <i className="fas fa-lock" /> Your data is safe with us. We&apos;ll
        respond within 24 hours.
      </p>
      
      <button
        type="submit"
        disabled={isSending}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-xl transition shadow-md flex-1 disabled:opacity-50"
      >
        {isSending ? (
          <><i className="fas fa-spinner fa-spin mr-2" /> Sending...</>
        ) : (
          <><i className="fas fa-paper-plane mr-2" /> Send Information</>
        )}
      </button>
    </form>
  );
}