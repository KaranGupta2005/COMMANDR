"use client";

import { Phone, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ContactNumber {
  label: string;
  number: string;
  description?: string;
}

interface ContactCardProps {
  title: string;
  contacts: ContactNumber[];
  variant?: "primary" | "secondary";
}

export default function ContactCard({ title, contacts, variant = "primary" }: ContactCardProps) {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const copyToClipboard = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedNumber(number);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const callNumber = (number: string) => {
    // Remove spaces and special chars for tel: link
    const cleanNumber = number.replace(/[^0-9]/g, '');
    window.location.href = `tel:${cleanNumber}`;
  };

  const bgColor = variant === "primary" 
    ? "bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/30" 
    : "bg-white/5 border-white/10";

  const accentColor = variant === "primary" ? "text-red-400" : "text-cyan-400";

  return (
    <div className={`${bgColor} backdrop-blur-xl border rounded-2xl p-6`}>
      <h3 className={`text-xl font-bold text-white mb-4 flex items-center gap-2`}>
        <Phone className={accentColor} size={24} />
        {title}
      </h3>

      <div className="space-y-3">
        {contacts.map((contact, idx) => (
          <div
            key={idx}
            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-4 transition-all group"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{contact.label}</p>
                {contact.description && (
                  <p className="text-gray-400 text-xs mt-1">{contact.description}</p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(contact.number)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  title="Copy number"
                >
                  {copiedNumber === contact.number ? (
                    <Check className="text-green-400" size={16} />
                  ) : (
                    <Copy className="text-gray-400 group-hover:text-white" size={16} />
                  )}
                </button>
                
                <button
                  onClick={() => callNumber(contact.number)}
                  className={`px-3 py-2 ${variant === "primary" ? "bg-red-500 hover:bg-red-600" : "bg-cyan-500 hover:bg-cyan-600"} text-white rounded-lg font-semibold text-sm transition-all transform hover:scale-105 flex items-center gap-2`}
                >
                  <Phone size={14} />
                  Call
                </button>
              </div>
            </div>

            <p className={`${variant === "primary" ? "text-red-300" : "text-cyan-300"} font-mono text-lg font-bold`}>
              {contact.number}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}