import { Mail, MapPin, Phone } from "lucide-react";

const quickLinks = [
  "Browse stays",
  "Compare listings",
  "Track inquiries",
  "Manage rooms",
];

export default function Footer() {
  return (
    <footer style={{ padding: "1.35rem 1.2rem 1.8rem" }}>
      <div className="boardmap-shell boardmap-shell-wide" style={{ padding: 0 }}>
        <div className="boardmap-panel-dark" style={{ padding: "1.2rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.1fr) repeat(2, minmax(0, 0.85fr))",
              gap: "1rem",
            }}
          >
            <div>
              <div className="boardmap-logo">
                <img src="/BoardMap_Logo_White.png" alt="BoardMap logo" />
                <div>
                  <p className="boardmap-logo-title">BoardMap</p>
                  <p className="boardmap-logo-tagline">
                    Housing search designed for the VSU community
                  </p>
                </div>
              </div>
              <p
                style={{
                  margin: "0.8rem 0 0",
                  color: "rgba(235,251,234,0.82)",
                  lineHeight: 1.6,
                  maxWidth: 390,
                  fontSize: "0.9rem",
                }}
              >
                A green-first platform for students and owners who want clearer
                information and stronger communication around boarding house search.
              </p>
            </div>

            <div>
              <strong style={{ display: "block", fontSize: "0.95rem" }}>What you can do</strong>
              <div style={{ display: "grid", gap: "0.45rem", marginTop: "0.75rem" }}>
                {quickLinks.map((item) => (
                  <span
                    key={item}
                    style={{ color: "rgba(235,251,234,0.82)", fontSize: "0.9rem" }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <strong style={{ display: "block", fontSize: "0.95rem" }}>Contact</strong>
              <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
                <a
                  href="mailto:support.boardmap@gmail.com"
                  style={{
                    display: "inline-flex",
                    gap: "0.55rem",
                    color: "rgba(235,251,234,0.92)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  <Mail size={16} />
                  support.boardmap@gmail.com
                </a>
                <a
                  href="tel:+639152111698"
                  style={{
                    display: "inline-flex",
                    gap: "0.55rem",
                    color: "rgba(235,251,234,0.92)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  <Phone size={16} />
                  +63 915 211 1698
                </a>
                <span
                  style={{
                    display: "inline-flex",
                    gap: "0.55rem",
                    color: "rgba(235,251,234,0.82)",
                    fontSize: "0.9rem",
                  }}
                >
                  <MapPin size={16} />
                  Visayas State University, Baybay City, Leyte
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              height: 1,
              background: "rgba(233,250,234,0.12)",
              margin: "1.1rem 0 0.8rem",
            }}
          />
          <p
            style={{
              margin: 0,
              color: "rgba(235,251,234,0.7)",
              fontSize: "0.82rem",
            }}
          >
            Copyright 2026 BoardMap. Crafted for a cleaner campus housing experience.
          </p>
        </div>
      </div>
    </footer>
  );
}