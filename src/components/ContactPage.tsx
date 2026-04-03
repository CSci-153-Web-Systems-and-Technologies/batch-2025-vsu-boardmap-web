import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, X } from "lucide-react";

interface ContactPageProps {
  onClose?: () => void;
}

function ContactContent({ onClose }: ContactPageProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactCards = useMemo(
    () => [
      {
        icon: Mail,
        title: "Email",
        value: "support.boardmap@gmail.com",
        href: "mailto:support.boardmap@gmail.com",
      },
      {
        icon: Phone,
        title: "Phone",
        value: "+63 915 211 1698",
        href: "tel:+639152111698",
      },
      {
        icon: MapPin,
        title: "Location",
        value: "Visayas State University, Baybay City, Leyte",
        href: "https://maps.google.com/?q=Visayas+State+University",
      },
    ],
    []
  );

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(formData.subject || "BoardMap inquiry");
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    );
    window.location.href = `mailto:support.boardmap@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="boardmap-panel-strong boardmap-modal-body" style={{ padding: "1.2rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div>
          <span className="boardmap-eyebrow">
            <Send size={14} />
            Contact BoardMap
          </span>
          <h2 className="boardmap-section-title" style={{ marginTop: "0.75rem" }}>
            Reach the team without leaving the same calm workspace.
          </h2>
          <p className="boardmap-section-copy" style={{ maxWidth: 620 }}>
            Use the quick contact details or open your email app with the message pre-filled.
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="boardmap-button-secondary"
            style={{ paddingInline: "0.9rem", minWidth: 44 }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="boardmap-compact-grid">
        <div className="boardmap-panel" style={{ padding: "1rem" }}>
          <h3 className="boardmap-section-title" style={{ fontSize: "1.12rem" }}>
            Quick contact options
          </h3>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.85rem" }}>
            {contactCards.map(({ icon: Icon, title, value, href }) => (
              <a
                key={title}
                href={href}
                target={title === "Location" ? "_blank" : undefined}
                rel={title === "Location" ? "noreferrer" : undefined}
                className="boardmap-list-card"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  gridTemplateColumns: "auto 1fr",
                  alignItems: "start",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, rgba(47,106,69,0.15), rgba(115,168,109,0.16))",
                    color: "#2f6a45",
                  }}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <strong style={{ display: "block", fontSize: "0.95rem" }}>{title}</strong>
                  <span
                    style={{
                      display: "block",
                      marginTop: "0.3rem",
                      color: "#4b6d5c",
                      lineHeight: 1.55,
                      fontSize: "0.9rem",
                    }}
                  >
                    {value}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <form className="boardmap-panel" style={{ padding: "1rem" }} onSubmit={handleSubmit}>
          <div className="boardmap-form-grid">
            <label className="boardmap-field">
              <span className="boardmap-label">Your name</span>
              <input
                className="boardmap-input"
                type="text"
                required
                value={formData.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="How should we address you?"
              />
            </label>
            <label className="boardmap-field">
              <span className="boardmap-label">Email address</span>
              <input
                className="boardmap-input"
                type="email"
                required
                value={formData.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="name@example.com"
              />
            </label>
            <label className="boardmap-field">
              <span className="boardmap-label">Subject</span>
              <input
                className="boardmap-input"
                type="text"
                required
                value={formData.subject}
                onChange={(event) => updateField("subject", event.target.value)}
                placeholder="What do you need help with?"
              />
            </label>
            <label className="boardmap-field">
              <span className="boardmap-label">Message</span>
              <textarea
                className="boardmap-textarea"
                style={{ minHeight: 100 }}
                required
                value={formData.message}
                onChange={(event) => updateField("message", event.target.value)}
                placeholder="Tell us what happened and how we can help."
              />
            </label>
          </div>

          {submitted && (
            <div className="boardmap-badge" style={{ marginTop: "0.85rem" }}>
              <Send size={14} />
              Your email app should open with the message pre-filled.
            </div>
          )}

          <button
            type="submit"
            className="boardmap-button-primary"
            style={{ width: "100%", marginTop: "0.85rem" }}
          >
            Send with my email app
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ContactPage({ onClose }: ContactPageProps) {
  if (onClose) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="boardmap-modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="boardmap-modal"
          style={{ width: "min(980px, 100%)" }}
          onClick={(event) => event.stopPropagation()}
        >
          <ContactContent onClose={onClose} />
        </motion.div>
      </motion.div>
    );
  }

  return <ContactContent />;
}