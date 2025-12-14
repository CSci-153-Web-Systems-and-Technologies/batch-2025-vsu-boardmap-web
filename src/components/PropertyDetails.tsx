import { useState, useEffect } from "react";
import {
  Property,
  Review,
  getPropertyReviews,
  createReview,
  createInquiry,
} from "../utils/api";
import {
  X,
  MapPin,
  Star,
  Home,
  Users,
  Bath,
  Bed,
  Phone,
  MessageSquare,
} from "lucide-react";
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
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [property.id]);

  const loadReviews = async () => {
    try {
      const propertyReviews = await getPropertyReviews(property.id);
      setReviews(propertyReviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (property.ownerPhone) {
      window.location.href = `tel:${property.ownerPhone}`;
    } else {
      toast.error("Phone number not available");
    }
  };

  const handleMessage = () => {
    if (onMessage && userId) {
      onMessage(
        property.ownerId,
        property.ownerName,
        property.id,
        property.title
      );
      onClose();
    } else {
      toast.error("Please sign in to send messages");
    }
  };

  const handleSubmitReview = async () => {
    if (!accessToken || !userId) {
      toast.error("Please sign in to leave a review");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Please write at least 10 characters");
      return;
    }

    try {
      setSubmitting(true);
      await createReview(
        {
          propertyId: property.id,
          rating,
          comment: comment.trim(),
        },
        accessToken
      );
      toast.success("Review submitted successfully!");
      setShowReviewForm(false);
      setComment("");
      setRating(5);
      await loadReviews();
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInquire = async () => {
    if (!accessToken || !userId) {
      toast.error("Please sign in to inquire");
      return;
    }

    try {
      await createInquiry(
        {
          propertyId: property.id,
          propertyTitle: property.title,
          ownerId: property.ownerId,
          message: `I'm interested in ${property.title}. Is it still available?`,
        },
        accessToken
      );
      toast.success("Inquiry sent to property owner!");
    } catch (error: any) {
      console.error("Error sending inquiry:", error);
      toast.error(error.message || "Failed to send inquiry");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999999] p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[20px] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-[10000000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#e7f0dc] p-4 md:p-6 flex items-center justify-between z-10 rounded-t-[20px]">
          <h2 className="font-['REM:SemiBold',sans-serif] text-[24px] md:text-[32px] text-[#4f6f52]">
            Property Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#e7f0dc] rounded-full transition-colors"
          >
            <X size={24} className="text-[#597445]" />
          </button>
        </div>

        {/* Image Placeholder */}
        <div className="relative h-[250px] md:h-[400px] bg-gradient-to-br from-[#e7f0dc] to-[#d4e5c8] flex items-center justify-center">
          <Home size={64} className="text-[#597445]/30" />
          <div className="absolute top-4 right-4 bg-white/95 px-4 py-2 rounded-full">
            <span
              className={`font-['Rethink_Sans:SemiBold',sans-serif] text-[14px] ${
                property.availability === "Available"
                  ? "text-[#79ac78]"
                  : "text-[#d97445]"
              }`}
            >
              {property.availability}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8 space-y-6">
          {/* Title and Price */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-['Rethink_Sans:Bold',sans-serif] text-[24px] md:text-[32px] text-[#4f6f52] mb-2">
                {property.title}
              </h3>
              <div className="flex items-center gap-2 text-[#597445] mb-3">
                <MapPin size={20} />
                <span className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] md:text-[16px]">
                  {property.address}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star size={20} className="text-[#fbbf24] fill-[#fbbf24]" />
                  <span className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] text-[#4f6f52]">
                    {property.rating.toFixed(1)}
                  </span>
                  <span className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#597445]">
                    ({property.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-[#e7f0dc] rounded-[15px] p-4 md:p-6 text-center">
              <span className="font-['Rethink_Sans:Bold',sans-serif] text-[32px] md:text-[40px] text-[#79ac78]">
                ₱{property.price.toLocaleString()}
              </span>
              <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#597445]">
                per month
              </p>
            </div>
          </div>

          {/* Property Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#e7f0dc] rounded-[12px] p-4 flex flex-col items-center gap-2">
              <Home size={24} className="text-[#597445]" />
              <span className="font-['Rethink_Sans:SemiBold',sans-serif] text-[14px] md:text-[16px] text-[#4f6f52]">
                {property.type}
              </span>
            </div>
            <div className="bg-[#e7f0dc] rounded-[12px] p-4 flex flex-col items-center gap-2">
              <Bed size={24} className="text-[#597445]" />
              <span className="font-['Rethink_Sans:SemiBold',sans-serif] text-[14px] md:text-[16px] text-[#4f6f52]">
                {property.bedrooms} Bedroom{property.bedrooms > 1 ? "s" : ""}
              </span>
            </div>
            <div className="bg-[#e7f0dc] rounded-[12px] p-4 flex flex-col items-center gap-2">
              <Bath size={24} className="text-[#597445]" />
              <span className="font-['Rethink_Sans:SemiBold',sans-serif] text-[14px] md:text-[16px] text-[#4f6f52]">
                {property.bathrooms} Bathroom{property.bathrooms > 1 ? "s" : ""}
              </span>
            </div>
            <div className="bg-[#e7f0dc] rounded-[12px] p-4 flex flex-col items-center gap-2">
              <Users size={24} className="text-[#597445]" />
              <span className="font-['Rethink_Sans:SemiBold',sans-serif] text-[14px] md:text-[16px] text-[#4f6f52]">
                {property.gender}
              </span>
            </div>
          </div>

          {/* Rooms Info (if multi-room) */}
          {property.rooms && property.rooms.length > 0 && (
            <div>
              <h4 className="font-['Rethink_Sans:SemiBold',sans-serif] text-[20px] md:text-[24px] text-[#4f6f52] mb-3">
                Available Rooms
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {property.rooms.map((room, index) => (
                  <div key={index} className="bg-[#e7f0dc] rounded-[10px] p-4">
                    <h5 className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] text-[#4f6f52] mb-2">
                      {room.roomNumber}
                    </h5>
                    <div className="space-y-1 text-[14px] text-[#597445]">
                      <p>Max Occupancy: {room.maxOccupancy} tenants</p>
                      <p>
                        Current: {room.currentOccupancy}/{room.maxOccupancy}
                      </p>
                      <p className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] text-[#79ac78]">
                        ₱{room.price.toLocaleString()}/month
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="font-['Rethink_Sans:SemiBold',sans-serif] text-[20px] md:text-[24px] text-[#4f6f52] mb-3">
              Description
            </h4>
            <div className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#597445] leading-relaxed">
              {property.description.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  {index < property.description.split("\n").length - 1 && (
                    <br />
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h4 className="font-['Rethink_Sans:SemiBold',sans-serif] text-[20px] md:text-[24px] text-[#4f6f52] mb-3">
              Amenities
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="bg-[#e7f0dc] rounded-[10px] p-3 font-['Rethink_Sans:Medium',sans-serif] text-[14px] md:text-[16px] text-[#597445] text-center"
                >
                  ✓ {amenity}
                </div>
              ))}
            </div>
          </div>

          {/* Owner Contact */}
          <div className="bg-[#e7f0dc] rounded-[15px] p-4 md:p-6">
            <h4 className="font-['Rethink_Sans:SemiBold',sans-serif] text-[20px] md:text-[24px] text-[#4f6f52] mb-3">
              Contact Owner
            </h4>
            <div className="space-y-2 mb-4">
              <p className="font-['Rethink_Sans:Medium',sans-serif] text-[16px] md:text-[18px] text-[#4f6f52]">
                {property.ownerName}
              </p>
              <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#597445]">
                {property.ownerEmail}
              </p>
              {property.ownerPhone && (
                <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#597445]">
                  {property.ownerPhone}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {property.ownerPhone && (
                <button
                  onClick={handleCall}
                  className="flex-1 bg-[#79ac78] hover:bg-[#6b9b69] text-white rounded-[12px] py-3 px-4 font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] transition-colors flex items-center justify-center gap-2"
                >
                  <Phone size={20} />
                  Call
                </button>
              )}
              <button
                onClick={handleMessage}
                className="flex-1 bg-[#597445] hover:bg-[#4f6f52] text-white rounded-[12px] py-3 px-4 font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare size={20} />
                Message
              </button>
            </div>
          </div>

          {/* Reviews Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-['Rethink_Sans:SemiBold',sans-serif] text-[20px] md:text-[24px] text-[#4f6f52]">
                Reviews ({reviews.length})
              </h4>
              {accessToken && !showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-[#597445] text-white px-4 py-2 rounded-[10px] hover:bg-[#4f6f52] transition-colors text-[14px] md:text-[16px]"
                >
                  Write a Review
                </button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="bg-[#e7f0dc] rounded-[12px] p-4 md:p-6 mb-4">
                <h5 className="font-['Rethink_Sans:SemiBold',sans-serif] text-[18px] text-[#4f6f52] mb-3">
                  Write Your Review
                </h5>
                <div className="space-y-4">
                  <div>
                    <label className="font-['Rethink_Sans:Medium',sans-serif] text-[14px] text-[#597445] block mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            size={32}
                            className={`${
                              star <= rating
                                ? "text-[#fbbf24] fill-[#fbbf24]"
                                : "text-[#d1d5db]"
                            } transition-colors`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="font-['Rethink_Sans:Medium',sans-serif] text-[14px] text-[#597445] block mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience..."
                      rows={4}
                      className="w-full bg-white border-2 border-[#597445] rounded-[10px] px-4 py-3 text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#79ac78] resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowReviewForm(false);
                        setComment("");
                        setRating(5);
                      }}
                      disabled={submitting}
                      className="flex-1 bg-white text-[#597445] border-2 border-[#597445] rounded-[10px] py-2 hover:bg-[#f5f5f5] transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitReview}
                      disabled={submitting || comment.trim().length < 10}
                      className="flex-1 bg-[#597445] text-white rounded-[10px] py-2 hover:bg-[#4f6f52] transition-colors disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {loading ? (
                <p className="font-['Rethink_Sans:Regular',sans-serif] text-[16px] text-[#597445] text-center py-4">
                  Loading reviews...
                </p>
              ) : reviews.length === 0 ? (
                <p className="font-['Rethink_Sans:Regular',sans-serif] text-[16px] text-[#597445] text-center py-4">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-[#e7f0dc] rounded-[12px] p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] text-[#4f6f52]">
                          {review.userName}
                        </p>
                        <p className="font-['Rethink_Sans:Regular',sans-serif] text-[12px] text-[#597445]">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${
                              i < review.rating
                                ? "text-[#fbbf24] fill-[#fbbf24]"
                                : "text-[#d1d5db]"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] text-[#597445]">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Inquire Button */}
          {accessToken && (
            <button
              onClick={handleInquire}
              className="w-full bg-[#79ac78] hover:bg-[#6b9b69] text-white rounded-[15px] py-4 font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] transition-colors"
            >
              Send Inquiry to Owner
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
