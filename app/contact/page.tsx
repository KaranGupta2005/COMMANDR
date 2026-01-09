"use client";

import { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  FileText,
  Users,
  Shield,
  Zap,
  CheckCircle
} from "lucide-react";

// FAQ Data
const faqs = [
  {
    question: "What is COMMANDR?",
    answer: "COMMANDR is an intelligent disaster management platform that connects victims, rescue teams, and logistics coordinators in real-time. It uses AI-powered algorithms to optimize response times and resource allocation during emergencies."
  },
  {
    question: "How do I report an emergency?",
    answer: "Citizens can report emergencies through the Victim Portal by clicking 'Report Emergency', adding location details, photos, and describing the situation. The system automatically prioritizes and assigns rescue teams based on severity and proximity."
  },
  {
    question: "Is COMMANDR available 24/7?",
    answer: "Yes, COMMANDR operates 24/7 with real-time monitoring. Our system continuously tracks disaster situations and coordinates with rescue teams across all regions to ensure immediate response."
  },
  {
    question: "How does the crowd simulation work?",
    answer: "Our crowd simulation uses real-time data to visualize concentration levels in affected areas. It clusters people based on location and severity, helping rescue teams identify high-priority zones and optimize their deployment strategy."
  },
  {
    question: "What types of disasters does COMMANDR handle?",
    answer: "COMMANDR manages all types of disasters including floods, earthquakes, fires, medical emergencies, cyclones, landslides, and more. The system adapts its response protocols based on the disaster type and severity."
  },
  {
    question: "How secure is my data on COMMANDR?",
    answer: "We use enterprise-grade encryption and follow strict data protection protocols. All personal information is stored securely and only accessed by authorized personnel during emergency response operations."
  },
  {
    question: "Can I track the status of my emergency request?",
    answer: "Yes, victims can track their request status in real-time through the 'My Requests' section. You'll receive updates on rescue team assignment, estimated arrival time, and resolution status."
  },
  {
    question: "How do rescue teams coordinate through COMMANDR?",
    answer: "Rescue teams access live mission queues, heatmaps, and optimal routes. The platform provides team coordination tools, resource management, and communication channels to ensure efficient collaboration during operations."
  },
  {
    question: "What is the What-If Simulator?",
    answer: "The What-If Simulator allows logistics coordinators to test various disaster scenarios, simulate resource failures, and prepare strategic responses. It helps plan for worst-case situations and optimize resource allocation."
  },
  {
    question: "How can my organization join COMMANDR?",
    answer: "Organizations can register through our platform by submitting a partnership request. We onboard rescue teams, NGOs, and government bodies after verification. Contact us through this page for more details."
  }
];

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all hover:border-purple-500/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-white font-semibold text-sm pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="text-purple-400 flex-shrink-0" size={20} />
        ) : (
          <ChevronDown className="text-purple-400 flex-shrink-0" size={20} />
        )}
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4">
          <p className="text-gray-400 text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

// Contact Form Component
function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call - replace with actual API endpoint
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    // Reset form
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Get in Touch</h2>
        <p className="text-gray-400">We're here to help. Send us a message and we'll respond as soon as possible.</p>
      </div>

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-white font-semibold mb-2 text-sm">Full Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="John Doe"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-semibold mb-2 text-sm">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white font-semibold mb-2 text-sm">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-white font-semibold mb-2 text-sm">Subject *</label>
          <select
            value={formData.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
          >
            <option value="" className="bg-gray-900">Select a subject</option>
            <option value="general" className="bg-gray-900">General Inquiry</option>
            <option value="partnership" className="bg-gray-900">Partnership Opportunity</option>
            <option value="support" className="bg-gray-900">Technical Support</option>
            <option value="feedback" className="bg-gray-900">Feedback</option>
            <option value="emergency" className="bg-gray-900">Emergency Services</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="block text-white font-semibold mb-2 text-sm">Message *</label>
          <textarea
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            rows={6}
            placeholder="Tell us how we can help you..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.name || !formData.email || !formData.subject || !formData.message}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${
            isSubmitting || !formData.name || !formData.email || !formData.subject || !formData.message
              ? "bg-gray-600 cursor-not-allowed" 
              : submitSuccess
              ? "bg-green-600"
              : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : submitSuccess ? (
            <>
              <CheckCircle size={20} />
              Message Sent Successfully!
            </>
          ) : (
            <>
              <Send size={20} />
              Send Message
            </>
          )}
        </button>
      </div>

      {/* Contact Info */}
      <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/20 p-3 rounded-xl">
            <Mail className="text-cyan-400" size={20} />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Email</p>
            <p className="text-white font-semibold text-sm">support@commandr.in</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/20 p-3 rounded-xl">
            <Phone className="text-cyan-400" size={20} />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Phone</p>
            <p className="text-white font-semibold text-sm">1800-COMMANDR</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/20 p-3 rounded-xl">
            <MapPin className="text-cyan-400" size={20} />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Location</p>
            <p className="text-white font-semibold text-sm">New Delhi, India</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function ContactUsPage() {
  const [emailSent, setEmailSent] = useState(false);

  const handleSendDocs = () => {
    setEmailSent(true);
    // Add your email sending logic here
    setTimeout(() => setEmailSent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1e0b3b] to-[#0f172a] p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Contact Us</h1>
        <p className="text-gray-400">Have questions? We'd love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ContactForm />

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-400">Quick answers to common questions</p>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 border border-orange-500/30 rounded-2xl p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-3">📚 Know About COMMANDR</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              Learn more about our mission, technology, and how we're revolutionizing disaster management in India. Get comprehensive documentation, case studies, and system architecture details delivered to your inbox.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500/20 p-2 rounded-lg">
                  <Users className="text-orange-400" size={20} />
                </div>
                <span className="text-white text-sm">Three-Tier Intelligence System</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-red-500/20 p-2 rounded-lg">
                  <Shield className="text-red-400" size={20} />
                </div>
                <span className="text-white text-sm">Real-time Coordination</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-pink-500/20 p-2 rounded-lg">
                  <Zap className="text-pink-400" size={20} />
                </div>
                <span className="text-white text-sm">AI-Powered Optimization</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <FileText className="text-purple-400" size={20} />
                </div>
                <span className="text-white text-sm">Comprehensive Documentation</span>
              </div>
            </div>

            <p className="text-gray-400 text-sm">
              Our documentation package includes system architecture, API references, deployment guides, and success stories from disaster response operations across India.
            </p>
          </div>

          <div className="lg:w-auto w-full">
            <button
              onClick={handleSendDocs}
              disabled={emailSent}
              className={`px-8 py-4 rounded-xl font-bold text-white transition-all transform hover:scale-105 flex items-center gap-3 whitespace-nowrap ${
                emailSent
                  ? "bg-green-600"
                  : "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600"
              }`}
            >
              {emailSent ? (
                <>
                  <CheckCircle size={24} />
                  Docs Sent to Email!
                </>
              ) : (
                <>
                  <FileText size={24} />
                  Send Documentation
                </>
              )}
            </button>

            <p className="text-gray-400 text-xs text-center mt-3">
              Complete system documentation<br />delivered to your registered email
            </p>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }
      `}</style>
    </div>
  );
}