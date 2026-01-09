"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  Phone,
  Copy,
  Check,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { stateContacts, StateContact } from "@/lib/types";

/* ---------- LOCAL NATIONAL CONTACTS ---------- */
const nationalContacts = [
  { label: "Emergency (All-in-One)", number: "112", description: "Police, Fire, Ambulance, Disaster" },
  { label: "Police", number: "100" },
  { label: "Fire", number: "101" },
  { label: "Ambulance", number: "108 / 102" },
  { label: "Disaster Management", number: "1078" },
  { label: "State Disaster Control", number: "1070" },
  { label: "District Disaster Control", number: "1077" },
  { label: "Women Helpline", number: "1091 / 181" },
  { label: "Child Helpline", number: "1098" },
];

/* ---------- LOCAL NATIONAL POLICIES ---------- */
const nationalPolicies = [
  {
    title: "Disaster Management Act, 2005",
    description: "Main law for disasters in India.",
  },
  {
    title: "National Policy on Disaster Management (2009)",
    description: "Focuses on prevention, mitigation, preparedness, response and recovery.",
  },
  {
    title: "National Disaster Management Plan (NDMP)",
    description: "Operational plan aligned with the Sendai Framework.",
  },
];

interface ContactNumber {
  label: string;
  number: string;
  description?: string;
}

/* -------------------- Contact Card -------------------- */
function ContactCard({
  title,
  contacts,
  variant = "primary",
}: {
  title: string;
  contacts: ContactNumber[];
  variant?: "primary" | "secondary";
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(num);
    setTimeout(() => setCopied(null), 2000);
  };

  const callNumber = (num: string) => {
    window.location.href = `tel:${num.replace(/[^0-9]/g, "")}`;
  };

  return (
    <div
      className={`backdrop-blur-xl border rounded-2xl p-6 ${
        variant === "primary"
          ? "bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/30"
          : "bg-white/5 border-white/10"
      }`}
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Phone className={variant === "primary" ? "text-red-400" : "text-cyan-400"} />
        {title}
      </h3>

      <div className="space-y-3">
        {contacts.map((c, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex justify-between mb-1">
              <div>
                <p className="text-white font-semibold text-sm">{c.label}</p>
                {c.description && (
                  <p className="text-gray-400 text-xs">{c.description}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button onClick={() => copyToClipboard(c.number)}>
                  {copied === c.number ? (
                    <Check className="text-green-400" size={16} />
                  ) : (
                    <Copy className="text-gray-400" size={16} />
                  )}
                </button>
                <button
                  onClick={() => callNumber(c.number)}
                  className="bg-cyan-500 px-3 py-1 rounded-lg text-white text-sm"
                >
                  Call
                </button>
              </div>
            </div>

            <p className="text-cyan-300 font-mono font-bold">{c.number}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------- Policy Section -------------------- */
function PolicySection({
  title,
  policies,
  defaultExpanded = true,
}: {
  title: string;
  policies: { title: string; description?: string }[];
  defaultExpanded?: boolean;
}) {
  const [open, setOpen] = useState(defaultExpanded);

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-6 flex justify-between items-center"
      >
        <h3 className="text-white font-bold flex gap-2">
          <FileText className="text-purple-400" />
          {title}
        </h3>
        {open ? <ChevronUp /> : <ChevronDown />}
      </button>

      {open && (
        <div className="px-6 pb-6 space-y-3">
          {policies.map((p, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h4 className="text-white text-sm font-semibold">{p.title}</h4>
              {p.description && (
                <p className="text-gray-400 text-xs">{p.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------- MAIN PAGE -------------------- */
export default function EmergencyContactsPage() {
  const [selectedState, setSelectedState] = useState<StateContact>(stateContacts[0]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filteredStates = stateContacts.filter((s) =>
    s.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0118] to-[#0f172a] p-8">
      <h1 className="text-4xl font-bold text-white mb-6">
        Emergency Contacts (India)
      </h1>

      {/* STATE SELECT */}
      <div className="bg-white/5 p-6 rounded-2xl mb-8 relative">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="text-cyan-400" />
          <h2 className="text-white font-bold">Select State / UT</h2>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="w-full flex justify-between items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
        >
          {selectedState.state}
          <ChevronDown />
        </button>

        {open && (
          <div className="absolute z-20 mt-2 w-full bg-[#0f172a] border border-white/10 rounded-xl p-3">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search state..."
                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1">
              {filteredStates.map((s) => (
                <button
                  key={s.stateCode}
                  onClick={() => {
                    setSelectedState(s);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:bg-cyan-500/20 hover:text-white"
                >
                  {s.state}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ContactCard
            title={`${selectedState.state} Emergency Contacts`}
            contacts={selectedState.contacts[0].numbers}
          />
          <ContactCard
            title="National Emergency Helplines"
            contacts={nationalContacts}
            variant="secondary"
          />
        </div>

        <div className="space-y-6">
          <PolicySection
            title={`${selectedState.state} Policies`}
            policies={[
              { title: selectedState.policies.policy },
              { title: selectedState.policies.plan },
            ]}
          />
          <PolicySection
            title="National Policies"
            policies={nationalPolicies}
            defaultExpanded={false}
          />
        </div>
      </div>
    </div>
  );
}
