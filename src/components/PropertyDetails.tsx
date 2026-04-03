import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bath,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Home,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Star,
  Users,
  X,
} from "lucide-react";
import { Property, Review, createReview, getPropertyReviews } from "../utils/api";
import { toast } from "sonner";

interface PropertyDetailsProps {
  property: Property;
  userId?: string;
  userName?: string;
  accessToken?: string;
  onClose: () => void;
  onMessage?: (
    ownerId: string,
    ownerName: string,
    propertyId: string,
    propertyTitle: string
  ) => void;
}

export default function PropertyDetails({
  property,
  userId,
  userName,
  accessToken,
  onClose,
  onMessage,
}: PropertyDetailsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const images = useMemo(() => {
    const propertyImages = Array.isArray(property.images) ? property.images.filter(Boolean) : [];
    return propertyImages.length > 0 ? propertyImages : [""];
  }, [property.images]);

  const ownerName = (property as any).owner_name || (property as any).ownerName || "Property owner";
  const ownerEmail = (property as any).owner_email || (property as any).ownerEmail || "No owner email provided";
  const ownerPhone = (property as any).owner_phone || (property as any).ownerPhone || "";
  const propertyRating = Number(property.rating || 0);
  const propertyReviews = Number(property.reviews || 0);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const propertyReviewList = await getPropertyReviews(property.id);
      setReviews(propertyReviewList);
    } catch (error) {
      console.error("Error loading reviews:", error);
      toast.error("We could not load reviews for this listing.");
    } finally {
      setLoading(false);
    }
  }, [property.id]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [property.id]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleCall = () => {
    if (!ownerPhone) {
      toast.error("This owner has not added a phone number yet.");
      return;
    }
    window.location.href = `tel:${ownerPhone}`;
  };

  const handleMessage = () => {
    if (!accessToken || !userId) {
      toast.error("Please sign in before sending a message.");
      return;
    }

    if (!onMessage) {
      toast.error("Messaging is unavailable right now.");
      return;
    }

    onMessage(property.owner_id, ownerName, property.id, property.title);
    onClose();
  };

  const handleSubmitReview = async () => {
    if (!accessToken || !userId) {
      toast.error("Please sign in before leaving a review.");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Please write at least 10 characters for your review.");
      return;
    }

    setSubmitting(true);
    try {
      await createReview(
        {
          propertyId: property.id,
          rating,
          comment: comment.trim(),
        },
        accessToken
      );
      toast.success("Review submitted successfully.");
      setShowReviewForm(false);
      setComment("");
      setRating(5);
      await loadReviews();
    } catch (error: any) {
      toast.error(error.message || "We could not save your review.");
    } finally {
      setSubmitting(false);
    }
  };

  const moveImage = (direction: number) => {
    setSelectedImageIndex((current) => {
      const nextIndex = current + direction;
      if (nextIndex < 0) return images.length - 1;
      if (nextIndex >= images.length) return 0;
      return nextIndex;
    });
  };

  return (
    <div className="boardmap-modal-overlay" onClick={onClose}>
      <div className="boardmap-modal boardmap-detail-modal" onClick={(event) => event.stopPropagation()}>
        <div className="boardmap-panel-strong boardmap-modal-body boardmap-detail-body boardmap-scroll">
          <div className="boardmap-detail-header">
            <div>
              <span className="boardmap-eyebrow">
                <Home size={16} />
                Listing details
              </span>
              <h2 className="boardmap-section-title" style={{ marginTop: "0.8rem" }}>
                {property.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="boardmap-button-secondary"
              style={{ paddingInline: "0.9rem", minWidth: 46 }}
            >
              <X size={18} />
            </button>
          </div>

          <div className="boardmap-detail-layout">
            <section className="boardmap-panel boardmap-detail-main">
              <div className="boardmap-detail-gallery">
                {images[selectedImageIndex] ? (
                  <img
                    src={images[selectedImageIndex]}
                    alt={`${property.title} preview ${selectedImageIndex + 1}`}
                    className="boardmap-detail-gallery-image"
                  />
                ) : (
                  <div className="boardmap-detail-gallery-fallback">
                    <Home size={44} />
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="boardmap-button-secondary"
                      style={{ position: "absolute", top: 16, left: 16, minWidth: 42, paddingInline: "0.75rem" }}
                      onClick={() => moveImage(-1)}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      className="boardmap-button-secondary"
                      style={{ position: "absolute", top: 16, right: 16, minWidth: 42, paddingInline: "0.75rem" }}
                      onClick={() => moveImage(1)}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="boardmap-detail-thumb-row boardmap-scroll">
                  {images.map((image, index) => (
                    <button
                      key={`${property.id}-${index}`}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`boardmap-detail-thumb ${
                        index === selectedImageIndex ? "boardmap-detail-thumb-active" : ""
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${property.title} thumbnail ${index + 1}`}
                        className="boardmap-detail-thumb-image"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="boardmap-inline-meta boardmap-detail-meta">
                <span>
                  <MapPin size={14} />
                  {property.address}
                </span>
                <span>
                  <Star size={14} />
                  {propertyRating.toFixed(1)} ({propertyReviews} reviews)
                </span>
                <span>{property.availability}</span>
              </div>

              <div className="boardmap-detail-content">
                <div className="boardmap-chip-row boardmap-detail-core-chips">
                  <span className="boardmap-chip">
                    <Home size={14} />
                    {property.type}
                  </span>
                  <span className="boardmap-chip">
                    <Users size={14} />
                    {property.gender}
                  </span>
                  <span className="boardmap-chip">
                    <BedDouble size={14} />
                    {property.bedrooms} bedrooms
                  </span>
                  <span className="boardmap-chip">
                    <Bath size={14} />
                    {property.bathrooms} bathrooms
                  </span>
                </div>

                <div className="boardmap-detail-section">
                  <h3 className="boardmap-section-title boardmap-detail-section-title">
                    Description
                  </h3>
                  <p className="boardmap-section-copy">{property.description}</p>
                </div>

                <div className="boardmap-detail-section">
                  <h3 className="boardmap-section-title boardmap-detail-section-title">
                    Amenities
                  </h3>
                  <div className="boardmap-chip-row boardmap-detail-amenities">
                    {(property.amenities || []).map((amenity) => (
                      <span key={amenity} className="boardmap-chip">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {property.rooms && property.rooms.length > 0 && (
                  <div className="boardmap-detail-section">
                    <h3 className="boardmap-section-title boardmap-detail-section-title">
                      Room breakdown
                    </h3>
                    <div className="boardmap-detail-room-grid">
                      {property.rooms.map((room) => (
                        <div key={room.roomNumber} className="boardmap-list-card boardmap-detail-room-card">
                          <div className="boardmap-detail-room-top">
                            <strong>{room.roomNumber}</strong>
                            <span className="boardmap-helper">
                              PHP {Number(room.price || 0).toLocaleString()} / month
                            </span>
                          </div>
                          <div className="boardmap-inline-meta boardmap-detail-room-meta">
                            <span>Max {room.maxOccupancy}</span>
                            <span>
                              Current {room.currentOccupancy}/{room.maxOccupancy}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="boardmap-detail-sidebar">
              <div className="boardmap-panel-dark boardmap-detail-price-card">
                <span className="boardmap-helper" style={{ color: "rgba(235,251,234,0.72)" }}>
                  Monthly price
                </span>
                <strong className="boardmap-detail-price-value">
                  PHP {Number(property.price || 0).toLocaleString()}
                </strong>
                <div className="boardmap-detail-dark-meta">
                  <span>{property.availability}</span>
                  <span>{property.type}</span>
                  <span>{property.bedrooms} bed</span>
                  <span>{property.bathrooms} bath</span>
                </div>
              </div>

              <div className="boardmap-panel boardmap-detail-side-card">
                <div className="boardmap-detail-side-header">
                  <h3 className="boardmap-section-title boardmap-detail-section-title">
                    Contact owner
                  </h3>
                </div>
                <div className="boardmap-detail-contact-stack">
                  <span className="boardmap-detail-contact-pill">{ownerName}</span>
                  <span className="boardmap-detail-contact-pill">
                    <Mail size={14} />
                    {ownerEmail}
                  </span>
                  {ownerPhone && (
                    <span className="boardmap-detail-contact-pill">
                      <Phone size={14} />
                      {ownerPhone}
                    </span>
                  )}
                </div>
                <div className="boardmap-detail-action-row">
                  {ownerPhone && (
                    <button type="button" className="boardmap-button-secondary" onClick={handleCall}>
                      <Phone size={16} />
                      Call owner
                    </button>
                  )}
                  <button type="button" className="boardmap-button-primary" onClick={handleMessage}>
                    <MessageSquare size={16} />
                    Message owner
                  </button>
                </div>
                {!accessToken && (
                  <p className="boardmap-helper">
                    Sign in first if you want to start a conversation from this view.
                  </p>
                )}
              </div>

              <div className="boardmap-panel boardmap-detail-side-card">
                <div className="boardmap-detail-review-header">
                  <h3 className="boardmap-section-title boardmap-detail-section-title">
                    Reviews ({reviews.length})
                  </h3>
                  {accessToken && !showReviewForm && (
                    <button
                      type="button"
                      className="boardmap-button-secondary"
                      onClick={() => setShowReviewForm(true)}
                    >
                      Write a review
                    </button>
                  )}
                </div>

                {showReviewForm && (
                  <div className="boardmap-panel boardmap-detail-review-form">
                    <div className="boardmap-field">
                      <span className="boardmap-label">Rating</span>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setRating(value)}
                            className={`boardmap-chip ${value <= rating ? "boardmap-chip-active" : ""}`}
                          >
                            <Star size={14} />
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                    <label className="boardmap-field" style={{ marginTop: "0.85rem" }}>
                      <span className="boardmap-label">Your review</span>
                      <textarea
                        className="boardmap-textarea"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        placeholder={`Share your experience${userName ? `, ${userName}` : ""}.`}
                      />
                    </label>
                    <div className="boardmap-detail-review-actions">
                      <button
                        type="button"
                        className="boardmap-button-secondary"
                        onClick={() => {
                          setShowReviewForm(false);
                          setComment("");
                          setRating(5);
                        }}
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="boardmap-button-primary"
                        onClick={handleSubmitReview}
                        disabled={submitting}
                      >
                        {submitting ? "Saving..." : "Submit review"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="boardmap-detail-review-list">
                  {loading ? (
                    <div className="boardmap-empty-state boardmap-detail-empty-state">
                      <strong>Loading reviews</strong>
                      <p>Please give us a moment to fetch the latest feedback.</p>
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="boardmap-empty-state boardmap-detail-empty-state">
                      <strong>No reviews yet</strong>
                      <p>Be the first person to share what this place was like.</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <article key={review.id} className="boardmap-list-card boardmap-detail-review-card">
                        <div className="boardmap-detail-review-card-top">
                          <div>
                            <strong>{review.userName}</strong>
                            <p className="boardmap-helper" style={{ marginTop: "0.22rem" }}>
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div style={{ display: "inline-flex", gap: 4 }}>
                            {[1, 2, 3, 4, 5].map((value) => (
                              <Star
                                key={`${review.id}-${value}`}
                                size={14}
                                fill={value <= review.rating ? "#f5c451" : "transparent"}
                                color={value <= review.rating ? "#f5c451" : "#adc8b7"}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="boardmap-section-copy" style={{ marginTop: "0.35rem" }}>
                          {review.comment}
                        </p>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
