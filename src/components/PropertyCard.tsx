import { Property } from "../utils/api";

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

export default function PropertyCard({ property, onClick }: PropertyCardProps) {
  // Get the first image URL from Supabase storage
  const imageSrc = property.images?.[0] || undefined;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-[15px] shadow-[0px_0px_10px_0px_rgba(89,116,69,0.2)] overflow-hidden flex flex-col hover:shadow-[0px_0px_20px_0px_rgba(89,116,69,0.3)] transition-all cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-[180px] sm:h-[200px] md:h-[220px] bg-[#e7f0dc] overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#597445]">
            No Image
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/95 px-3 py-1 rounded-full">
          <span
            className={`font-['Rethink_Sans:SemiBold',sans-serif] text-[12px] ${
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
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex flex-col gap-2">
          <h3 className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] sm:text-[18px] text-[#4f6f52] line-clamp-2">
            {property.title}
          </h3>
          <p className="font-['Rethink_Sans:Regular',sans-serif] text-[13px] sm:text-[14px] text-[#597445] line-clamp-2">
            {property.description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-[#597445]">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="font-['Rethink_Sans:Regular',sans-serif] text-[12px] sm:text-[13px] line-clamp-1">
            {property.address}
          </span>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-4 text-[#597445]">
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="font-['Rethink_Sans:Medium',sans-serif] text-[12px]">
              {property.type}
            </span>
          </div>
          <span className="text-[#e7f0dc]">•</span>
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            <span className="font-['Rethink_Sans:Medium',sans-serif] text-[12px]">
              {property.bedrooms} bed
            </span>
          </div>
          <span className="text-[#e7f0dc]">•</span>
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-['Rethink_Sans:Medium',sans-serif] text-[12px]">
              {property.bathrooms} bath
            </span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5">
          {property.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="bg-[#e7f0dc] px-2 py-1 rounded-[8px] font-['Rethink_Sans:Medium',sans-serif] text-[11px] sm:text-[12px] text-[#597445]"
            >
              {amenity}
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className="bg-[#e7f0dc] px-2 py-1 rounded-[8px] font-['Rethink_Sans:Medium',sans-serif] text-[11px] sm:text-[12px] text-[#597445]">
              +{property.amenities.length - 3}
            </span>
          )}
        </div>

        {/* Price and Rating */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#e7f0dc]">
          <div className="flex flex-col">
            <span className="font-['Rethink_Sans:Bold',sans-serif] text-[20px] sm:text-[22px] text-[#79ac78]">
              ₱{property.price.toLocaleString()}
            </span>
            <span className="font-['Rethink_Sans:Regular',sans-serif] text-[11px] sm:text-[12px] text-[#597445]">
              per month
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#fbbf24] text-[18px] sm:text-[20px]">★</span>
            <div className="flex flex-col items-start">
              <span className="font-['Rethink_Sans:SemiBold',sans-serif] text-[14px] sm:text-[15px] text-[#4f6f52]">
                {property.rating.toFixed(1)}
              </span>
              <span className="font-['Rethink_Sans:Regular',sans-serif] text-[10px] sm:text-[11px] text-[#597445]">
                ({property.reviews} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Owner Info */}
        <div className="flex items-center justify-between text-[#597445] pt-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#e7f0dc] rounded-full flex items-center justify-center">
              <span className="font-['Rethink_Sans:Medium',sans-serif] text-[10px] text-[#79ac78]">
                {property.ownerName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="font-['Rethink_Sans:Medium',sans-serif] text-[12px]">
              {property.ownerName}
            </span>
          </div>
          <span className="font-['Rethink_Sans:Medium',sans-serif] text-[12px]">
            {property.gender}
          </span>
        </div>
      </div>
    </div>
  );
}
