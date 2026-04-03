import { motion } from "framer-motion";
import {
  Compass,
  Leaf,
  MapPinned,
  MessageCircleMore,
  ShieldCheck,
  X,
} from "lucide-react";

interface AboutPageProps {
  onClose?: () => void;
}

const highlights = [
  {
    icon: MapPinned,
    title: "Campus-aware discovery",
    description:
      "Keep listings centered on the VSU area so students compare distance and access faster.",
  },
  {
    icon: MessageCircleMore,
    title: "Conversation-first owner flow",
    description:
      "Questions, follow-ups, and replies stay in one clean thread instead of scattered chats.",
  },
  {
    icon: ShieldCheck,
    title: "Clear listing details",
    description:
      "Students see pricing, amenities, room setup, and availability before planning a visit.",
  },
];

const valuePoints = [
  {
    title: "Students",
    description: "Compare faster and focus on rooms that fit your budget and routine.",
  },
  {
    title: "Owners",
    description: "Manage listings and inquiries with less friction and less back-and-forth.",
  },
  {
    title: "VSU",
    description: "A platform tuned for the local housing search around the campus community.",
  },
];

function AboutContent({ onClose }: AboutPageProps) {
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
            <Compass size={14} />
            About BoardMap
          </span>
          <h2 className="boardmap-section-title" style={{ marginTop: "0.75rem" }}>
            A calmer, greener way to connect VSU students with nearby housing.
          </h2>
          <p className="boardmap-section-copy" style={{ maxWidth: 620 }}>
            BoardMap reduces the noise in boarding house search with a focused map,
            cleaner comparisons, and direct communication between students and owners.
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
        <div className="boardmap-panel-dark" style={{ padding: "1.2rem" }}>
          <span
            className="boardmap-eyebrow"
            style={{ background: "rgba(255,255,255,0.1)", color: "#effdea" }}
          >
            <Leaf size={14} />
            Why it works
          </span>
          <p
            style={{
              margin: "0.75rem 0 0",
              color: "rgba(235,251,234,0.82)",
              lineHeight: 1.6,
              fontSize: "0.92rem",
            }}
          >
            The platform is shaped around real campus housing needs: quick discovery,
            stronger listing clarity, and fewer broken handoffs between inquiry and move-in.
          </p>

          <div className="boardmap-mini-kpi-grid" style={{ marginTop: "0.95rem" }}>
            {valuePoints.map((item) => (
              <div key={item.title} className="boardmap-mini-kpi">
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="boardmap-highlight-grid">
          {highlights.map(({ icon: Icon, title, description }) => (
            <div key={title} className="boardmap-list-card">
              <div
                style={{
                  display: "inline-flex",
                  width: 44,
                  height: 44,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, rgba(47,106,69,0.15), rgba(115,168,109,0.16))",
                  color: "#2f6a45",
                }}
              >
                <Icon size={20} />
              </div>
              <div>
                <h3 className="boardmap-section-title" style={{ fontSize: "1.02rem" }}>
                  {title}
                </h3>
                <p className="boardmap-section-copy">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AboutPage({ onClose }: AboutPageProps) {
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
          <AboutContent onClose={onClose} />
        </motion.div>
      </motion.div>
    );
  }

  return <AboutContent />;
}