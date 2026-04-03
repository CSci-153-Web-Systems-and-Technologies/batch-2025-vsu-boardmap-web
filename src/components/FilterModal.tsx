import { useEffect, useState } from "react";
import { SlidersHorizontal, Star, X } from "lucide-react";
import { FilterOptions } from "../utils/api";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApply: (filters: FilterOptions) => void;
}

const propertyTypes = [
  "Studio",
  "Private Room",
  "Shared Room",
  "Bed Space",
  "Apartment",
];

const genders = ["Male", "Female", "Any"];
const availabilityOptions = ["Available", "Occupied"];
const amenities = [
  "WiFi",
  "Air Conditioning",
  "Kitchen",
  "Parking",
  "Laundry",
  "Security",
  "Study Desk",
  "Free Water",
  "Free Electricity",
  "Television",
  "Comfort Room",
  "Smoking Allowed",
  "Pets Allowed",
  "No Curfew",
  "Visitors Allowed",
];

const ratingOptions = [0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

function ToggleChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`boardmap-chip ${active ? "boardmap-chip-active" : ""}`}
      style={{ border: "1px solid rgba(47, 106, 69, 0.12)" }}
    >
      {label}
    </button>
  );
}

export default function FilterModal({
  isOpen,
  onClose,
  filters,
  onApply,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  if (!isOpen) {
    return null;
  }

  const toggleArrayFilter = (array: string[], value: string) =>
    array.includes(value) ? array.filter((entry) => entry !== value) : [...array, value];

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      priceRange: [0, 10000],
      propertyTypes: [],
      gender: [],
      amenities: [],
      availability: [],
      rating: 0,
    };
    setLocalFilters(resetFilters);
    onApply(resetFilters);
  };

  return (
    <div className="boardmap-modal-overlay" onClick={onClose}>
      <div className="boardmap-modal" onClick={(event) => event.stopPropagation()}>
        <div className="boardmap-panel-strong boardmap-modal-body boardmap-scroll" style={{ padding: "1.4rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            <div>
              <span className="boardmap-eyebrow">
                <SlidersHorizontal size={16} />
                Refine results
              </span>
              <h2 className="boardmap-section-title" style={{ marginTop: "0.9rem" }}>
                Tune the listing view without losing your place.
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="boardmap-button-secondary"
              style={{ paddingInline: "0.95rem", minWidth: 46 }}
            >
              <X size={18} />
            </button>
          </div>

          <div className="boardmap-form-grid">
            <section className="boardmap-panel" style={{ padding: "1rem" }}>
              <label className="boardmap-label">Price range</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
                  gap: "0.75rem",
                  alignItems: "center",
                  marginTop: "0.75rem",
                }}
              >
                <input
                  className="boardmap-input"
                  type="number"
                  value={localFilters.priceRange[0]}
                  onChange={(event) =>
                    setLocalFilters((current) => ({
                      ...current,
                      priceRange: [Number(event.target.value) || 0, current.priceRange[1]],
                    }))
                  }
                  placeholder="Min"
                />
                <span className="boardmap-helper">to</span>
                <input
                  className="boardmap-input"
                  type="number"
                  value={localFilters.priceRange[1]}
                  onChange={(event) =>
                    setLocalFilters((current) => ({
                      ...current,
                      priceRange: [current.priceRange[0], Number(event.target.value) || 10000],
                    }))
                  }
                  placeholder="Max"
                />
              </div>
              <input
                style={{ width: "100%", marginTop: "0.9rem", accentColor: "#2f6a45" }}
                type="range"
                min="0"
                max="10000"
                step="100"
                value={localFilters.priceRange[1]}
                onChange={(event) =>
                  setLocalFilters((current) => ({
                    ...current,
                    priceRange: [current.priceRange[0], Number(event.target.value)],
                  }))
                }
              />
            </section>

            <section className="boardmap-panel" style={{ padding: "1rem" }}>
              <label className="boardmap-label">Property type</label>
              <div className="boardmap-chip-row" style={{ marginTop: "0.8rem" }}>
                {propertyTypes.map((type) => (
                  <ToggleChip
                    key={type}
                    label={type}
                    active={localFilters.propertyTypes.includes(type)}
                    onClick={() =>
                      setLocalFilters((current) => ({
                        ...current,
                        propertyTypes: toggleArrayFilter(current.propertyTypes, type),
                      }))
                    }
                  />
                ))}
              </div>
            </section>

            <section className="boardmap-panel" style={{ padding: "1rem" }}>
              <label className="boardmap-label">Gender preference</label>
              <div className="boardmap-chip-row" style={{ marginTop: "0.8rem" }}>
                {genders.map((gender) => (
                  <ToggleChip
                    key={gender}
                    label={gender}
                    active={localFilters.gender.includes(gender)}
                    onClick={() =>
                      setLocalFilters((current) => ({
                        ...current,
                        gender: toggleArrayFilter(current.gender, gender),
                      }))
                    }
                  />
                ))}
              </div>
            </section>

            <section className="boardmap-panel" style={{ padding: "1rem" }}>
              <label className="boardmap-label">Amenities</label>
              <div className="boardmap-chip-row" style={{ marginTop: "0.8rem" }}>
                {amenities.map((amenity) => (
                  <ToggleChip
                    key={amenity}
                    label={amenity}
                    active={localFilters.amenities.includes(amenity)}
                    onClick={() =>
                      setLocalFilters((current) => ({
                        ...current,
                        amenities: toggleArrayFilter(current.amenities, amenity),
                      }))
                    }
                  />
                ))}
              </div>
            </section>

            <section className="boardmap-panel" style={{ padding: "1rem" }}>
              <label className="boardmap-label">Availability</label>
              <div className="boardmap-chip-row" style={{ marginTop: "0.8rem" }}>
                {availabilityOptions.map((status) => (
                  <ToggleChip
                    key={status}
                    label={status}
                    active={localFilters.availability.includes(status)}
                    onClick={() =>
                      setLocalFilters((current) => ({
                        ...current,
                        availability: toggleArrayFilter(current.availability, status),
                      }))
                    }
                  />
                ))}
              </div>
            </section>

            <section className="boardmap-panel" style={{ padding: "1rem" }}>
              <label className="boardmap-label">Minimum rating</label>
              <div className="boardmap-chip-row" style={{ marginTop: "0.8rem" }}>
                {ratingOptions.map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() =>
                      setLocalFilters((current) => ({
                        ...current,
                        rating,
                      }))
                    }
                    className={`boardmap-chip ${
                      localFilters.rating === rating ? "boardmap-chip-active" : ""
                    }`}
                    style={{ border: "1px solid rgba(47, 106, 69, 0.12)" }}
                  >
                    <Star size={14} />
                    {rating === 0 ? "Any rating" : `${rating}+`}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "flex-end",
              marginTop: "1.2rem",
              flexWrap: "wrap",
            }}
          >
            <button type="button" onClick={handleReset} className="boardmap-button-secondary">
              Reset filters
            </button>
            <button type="button" onClick={handleApply} className="boardmap-button-primary">
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
