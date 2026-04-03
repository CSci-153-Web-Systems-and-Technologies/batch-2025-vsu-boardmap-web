import { motion } from "framer-motion";
import { Compass, Leaf } from "lucide-react";

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="boardmap-page"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <motion.div
        className="boardmap-panel-dark"
        style={{ width: "min(680px, 100%)", padding: "2rem", textAlign: "center" }}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
          style={{ display: "inline-flex", marginBottom: "1.25rem" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 78,
              height: 78,
              borderRadius: 24,
              background: "rgba(255,255,255,0.08)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
            }}
          >
            <Compass size={34} color="#f2fff0" />
          </div>
        </motion.div>

        <div
          className="boardmap-logo"
          style={{ justifyContent: "center", marginBottom: "1rem" }}
        >
          <img src="/BoardMap_Logo_White.png" alt="BoardMap logo" />
          <div style={{ textAlign: "left" }}>
            <p className="boardmap-logo-title">BoardMap</p>
            <p className="boardmap-logo-tagline">Preparing your housing dashboard</p>
          </div>
        </div>

        <h1 className="boardmap-section-title" style={{ color: "#f3fff1" }}>
          Loading the greener, cleaner BoardMap experience.
        </h1>
        <p
          style={{
            margin: "0.9rem auto 0",
            color: "rgba(235,251,234,0.82)",
            maxWidth: 480,
            lineHeight: 1.75,
          }}
        >
          We are connecting your session, map data, and messaging tools so the
          app opens in a ready state.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.65rem",
            marginTop: "1.6rem",
          }}
        >
          {[0, 1, 2].map((item) => (
            <motion.span
              key={item}
              animate={{ y: [0, -7, 0], opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: item * 0.16 }}
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: "linear-gradient(135deg, #8ec58a, #d9f1cb)",
                display: "inline-block",
              }}
            />
          ))}
        </div>

        <div
          className="boardmap-badge"
          style={{
            justifyContent: "center",
            marginTop: "1.4rem",
            background: "rgba(255,255,255,0.08)",
            color: "#effdea",
          }}
        >
          <Leaf size={16} />
          Syncing listings, map markers, and messages
        </div>
      </motion.div>
    </motion.div>
  );
}
