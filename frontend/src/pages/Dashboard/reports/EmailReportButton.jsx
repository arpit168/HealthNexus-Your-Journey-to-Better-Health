import React, { useState } from "react";
import {
  Mail,
  X,
  Plus,
  Trash2,
  Share2,
  CheckCircle,
  Loader,
} from "lucide-react";
import { reportsService } from "../../../Services/reportsService";

export default function EmailReportButton({ reportData, onComplete }) {
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [options, setOptions] = useState({
    recipients: ["user@example.com"],
    cc: [],
    bcc: [],
    subject: "Your Weekly Fitness Report",
    message:
      "Please find attached your detailed fitness report with insights and recommendations.",
    format: "pdf",
    scheduleTime: "now",
    scheduleDate: new Date().toISOString().split("T")[0],
    scheduleTime_value: "09:00",
    recurring: false,
    recurringType: "weekly",
    template: "standard",
  });
  const [recipientInput, setRecipientInput] = useState("");
  const [ccInput, setCcInput] = useState("");
  const [bbcInput, setBbcInput] = useState("");

  const addRecipient = () => {
    if (recipientInput && !options.recipients.includes(recipientInput)) {
      setOptions({
        ...options,
        recipients: [...options.recipients, recipientInput],
      });
      setRecipientInput("");
    }
  };

  const removeRecipient = (email) => {
    setOptions({
      ...options,
      recipients: options.recipients.filter((r) => r !== email),
    });
  };

  const addCC = () => {
    if (ccInput && !options.cc.includes(ccInput)) {
      setOptions({
        ...options,
        cc: [...options.cc, ccInput],
      });
      setCcInput("");
    }
  };

  const removeCC = (email) => {
    setOptions({
      ...options,
      cc: options.cc.filter((c) => c !== email),
    });
  };

  const handleSend = async () => {
    setSending(true);
    setSuccess(false);

    try {
      // Prepare email data
      const emailData = {
        recipients: options.recipients,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        message: options.message,
        format: options.format,
        reportData: reportData,
        recurring: options.recurring
          ? {
              enabled: true,
              frequency: options.recurringType,
            }
          : null,
        scheduledFor:
          options.scheduleTime === "schedule"
            ? `${options.scheduleDate}T${options.scheduleTime_value}`
            : null,
      };

      // Send email via service
      await reportsService.emailReport(options.recipients, reportData, {
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        message: options.message,
        format: options.format,
        schedule: emailData.scheduledFor,
        recurring: emailData.recurring,
      });

      setSuccess(true);

      // Close modal after success
      setTimeout(() => {
        setShowModal(false);
        setSending(false);
        setSuccess(false);
        if (onComplete) onComplete(true);
      }, 2000);
    } catch (error) {
      console.error("Email send failed:", error);
      setSending(false);
      // Could add error state/notification here
    }
  };

  const shareToSocial = (platform) => {
    const text = `Check out my fitness report! 💪`;
    const urlPatterns = {
      slack: `https://slack.com/share?url=fitness-report&text=${encodeURIComponent(text)}`,
      teams: `https://teams.microsoft.com/share?url=fitness-report&text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + "\nCheck out my fitness progress!")}`,
    };

    if (urlPatterns[platform]) {
      window.open(urlPatterns[platform], "_blank");
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition"
      >
        <Mail size={18} />
        Email Report
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                Share Report via Email
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Recipients */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Recipients
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={recipientInput}
                      onChange={(e) => setRecipientInput(e.target.value)}
                      placeholder="Enter email address"
                      className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      onKeyPress={(e) => e.key === "Enter" && addRecipient()}
                    />
                    <button
                      onClick={addRecipient}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {options.recipients.map((email) => (
                      <div
                        key={email}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-600/30 text-blue-200 rounded-lg"
                      >
                        {email}
                        <button
                          onClick={() => removeRecipient(email)}
                          className="text-blue-300 hover:text-white"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CC */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  CC (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={ccInput}
                    onChange={(e) => setCcInput(e.target.value)}
                    placeholder="Enter email for CC"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    onKeyPress={(e) => e.key === "Enter" && addCC()}
                  />
                  <button
                    onClick={addCC}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                {options.cc.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {options.cc.map((email) => (
                      <div
                        key={email}
                        className="flex items-center gap-2 px-3 py-1 bg-gray-700 text-gray-200 rounded-lg"
                      >
                        {email}
                        <button
                          onClick={() => removeCC(email)}
                          className="text-gray-300 hover:text-white"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={options.subject}
                  onChange={(e) =>
                    setOptions({ ...options, subject: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Message
                </label>
                <textarea
                  value={options.message}
                  onChange={(e) =>
                    setOptions({ ...options, message: e.target.value })
                  }
                  placeholder="Add a custom message..."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 h-24 resize-none"
                />
              </div>

              {/* Format */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Email Format
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["pdf", "html", "csv"].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setOptions({ ...options, format: fmt })}
                      className={`py-2 px-4 rounded-lg font-medium uppercase transition ${
                        options.format === fmt
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Schedule
                </label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {["now", "schedule"].map((sched) => (
                    <button
                      key={sched}
                      onClick={() =>
                        setOptions({ ...options, scheduleTime: sched })
                      }
                      className={`py-2 px-4 rounded-lg font-medium capitalize transition ${
                        options.scheduleTime === sched
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {sched === "now" ? "Send Now" : "Schedule Later"}
                    </button>
                  ))}
                </div>
                {options.scheduleTime === "schedule" && (
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={options.scheduleDate}
                      onChange={(e) =>
                        setOptions({ ...options, scheduleDate: e.target.value })
                      }
                      className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                    <input
                      type="time"
                      value={options.scheduleTime_value}
                      onChange={(e) =>
                        setOptions({
                          ...options,
                          scheduleTime_value: e.target.value,
                        })
                      }
                      className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                )}
              </div>

              {/* Recurring */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.recurring}
                  onChange={(e) =>
                    setOptions({ ...options, recurring: e.target.checked })
                  }
                  className="w-5 h-5 rounded accent-blue-600"
                />
                <span className="text-gray-300">
                  Set up recurring email reports
                </span>
              </label>

              {options.recurring && (
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Frequency
                  </label>
                  <select
                    value={options.recurringType}
                    onChange={(e) =>
                      setOptions({ ...options, recurringType: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}

              {/* Social Share */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Share to Social Media
                </label>
                <div className="flex gap-2">
                  {[
                    { name: "Slack", icon: "💬" },
                    { name: "Teams", icon: "📊" },
                    { name: "WhatsApp", icon: "💬" },
                  ].map((social) => (
                    <button
                      key={social.name}
                      onClick={() => shareToSocial(social.name.toLowerCase())}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition"
                    >
                      <span>{social.icon}</span>
                      {social.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm font-semibold mb-2">
                  Email Preview
                </p>
                <p className="text-gray-300 text-sm">
                  To: {options.recipients.join(", ")}{" "}
                  {options.cc.length > 0 && `| CC: ${options.cc.join(", ")}`}
                </p>
                <p className="text-gray-300 text-sm mt-1">
                  Subject: {options.subject}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-700">
              <button
                onClick={() => setShowModal(false)}
                disabled={sending || success}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={sending || success || options.recipients.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition transform hover:scale-105"
              >
                {success ? (
                  <>
                    <CheckCircle size={18} />
                    Sent Successfully!
                  </>
                ) : sending ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail size={18} />
                    {options.scheduleTime === "now" ? "Send Now" : "Schedule"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
