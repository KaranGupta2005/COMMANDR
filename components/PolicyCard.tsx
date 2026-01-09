"use client";

import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface PolicyCardProps {
  title: string;
  description?: string;
  isNational?: boolean;
}

interface PolicySectionProps {
  title: string;
  policies: PolicyCardProps[];
  defaultExpanded?: boolean;
}

function PolicyItem({ title, description, isNational }: PolicyCardProps) {
  return (
    <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 rounded-xl p-4 transition-all">
      <div className="flex items-start gap-3">
        <FileText className={isNational ? "text-purple-400" : "text-blue-400"} size={20} className="mt-1 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-white font-semibold text-sm mb-1">{title}</h4>
          {description && (
            <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PolicySection({ title, policies, defaultExpanded = true }: PolicySectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="text-purple-400" size={24} />
          {title}
        </h3>
        {isExpanded ? (
          <ChevronUp className="text-purple-400" size={24} />
        ) : (
          <ChevronDown className="text-purple-400" size={24} />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-3 max-h-[600px] overflow-y-auto">
          {policies.map((policy, idx) => (
            <PolicyItem key={idx} {...policy} />
          ))}
        </div>
      )}
    </div>
  );
}