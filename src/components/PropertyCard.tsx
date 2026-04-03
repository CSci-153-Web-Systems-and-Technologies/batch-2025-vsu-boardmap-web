import {
  Bath,
  BedDouble,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { Property } from "../utils/api";

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

export default function PropertyCard({ property, onClick }: PropertyCardProps) {
  const imageSrc = property.images?.[0];
  const ownerName = (property as any).owner_name || (property as any).ownerName || "Owner";
  const rating = Number(property.rating || 0);
  const reviews = Number(property.reviews || 0);
  const amenities = Array.isArray(property.amenities) ? property.amenities : [];
  const compactPillStyle = {
    padding: "0.28rem 0.56rem",
    fontSize: "0.79rem",
  } as const;

  return (
    <button
      type="button"
      onClick={onClick}
      className="boardmap-list-card"
      style={{
        textAlign: "left",
        cursor: "pointer",
        overflow: "hidden",
        padding: 0,
      }}
    >
      <div style={{ position: "relative", minHeight: 154, background: "#dbead5" }}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={property.title}
            style={{ width: "100%", height: 160, objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: 160,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2f6a45",
              background: "linear-gradient(135deg, rgba(47,106,69,0.14), rgba(115,168,109,0.18))",
            }}
          >
            <Sparkles size={32} />
          </div>
        )}

        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          <span className="boardmap-badge" style={{ background: "rgba(255,255,255,0.92)" }}>
            <ShieldCheck size={14} />
            {property.availability}
          </span>
        </div>
      </div>

      <div style={{ padding: "0.78rem 0.85rem 0.82rem", display: "grid", gap: "0.55rem" }}>
        <div>
          <h3 className="boardmap-section-title" style={{ fontSize: "1rem", lineHeight: 1.12 }}>
            {property.title}
          </h3>
          <p
            className="boardmap-section-copy"
            style={{
              marginTop: "0.24rem",
              fontSize: "0.9rem",
              lineHeight: 1.42,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {property.description}
          </p>
        </div>

        <div className="boardmap-inline-meta" style={{ gap: "0.35rem", fontSize: "0.9rem" }}>
          <span style={compactPillStyle}>
            <MapPin size={13} />
            {property.address}
          </span>
          <span style={compactPillStyle}>
            <BedDouble size={13} />
            {property.bedrooms} bed
          </span>
          <span style={compactPillStyle}>
            <Bath size={13} />
            {property.bathrooms} bath
          </span>
        </div>

        <div className="boardmap-chip-row" style={{ gap: "0.32rem" }}>
          <span className="boardmap-chip" style={compactPillStyle}>{property.type}</span>
          <span className="boardmap-chip" style={compactPillStyle}>{property.gender}</span>
          {amenities.slice(0, 1).map((amenity) => (
            <span key={amenity} className="boardmap-chip" style={compactPillStyle}>
              {amenity}
            </span>
          ))}
          {amenities.length > 1 && (
            <span className="boardmap-chip" style={compactPillStyle}>+{amenities.length - 1} more</span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.65rem",
            paddingTop: "0.05rem",
          }}
        >
          <div>
            <strong
              style={{
                display: "block",
                color: "#214f34",
                fontSize: "1.08rem",
                fontWeight: 800,
              }}
            >
              PHP {Number(property.price || 0).toLocaleString()}
            </strong>
            <span className="boardmap-helper" style={{ fontSize: "0.8rem" }}>per month</span>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Star size={15} fill="#f5c451" color="#f5c451" />
              <strong style={{ color: "#214f34", fontSize: "0.9rem" }}>{rating.toFixed(1)}</strong>
            </div>
            <div className="boardmap-helper" style={{ fontSize: "0.78rem" }}>{reviews} reviews</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.6rem",
            paddingTop: "0.58rem",
            borderTop: "1px solid rgba(47, 106, 69, 0.12)",
          }}
        >
          <span className="boardmap-helper" style={{ fontSize: "0.8rem" }}>Hosted by {ownerName}</span>
          <span className="boardmap-button-secondary" style={{ padding: "0.5rem 0.78rem", fontSize: "0.88rem" }}>
            View details
          </span>
        </div>
      </div>
    </button>
  );
}
