import { useState } from "react";
import svgPaths from "../imports/svg-kdfhcdtos";
import { FilterOptions } from "../utils/api";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApply: (filters: FilterOptions) => void;
}

function X() {
  return (
    <div className="relative shrink-0 size-6 md:size-[30px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 30 30"
      >
        <g id="X">
          <path
            d={svgPaths.p6985300}
            id="Icon"
            stroke="var(--stroke-0, #597445)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
        </g>
      </svg>
    </div>
  );
}

export default function FilterModal({
  isOpen,
  onClose,
  filters,
  onApply,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  if (!isOpen) return null;

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

  const toggleArrayFilter = (array: string[], value: string) => {
    if (array.includes(value)) {
      return array.filter((v) => v !== value);
    } else {
      return [...array, value];
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center modal-overlay z-[150] p-4">
      <div className="bg-[#e7f0dc] rounded-[20px] shadow-[0px_0px_20px_0px_rgba(89,116,69,0.3)] w-full max-w-[90vw] md:max-w-[600px] max-h-[90vh] overflow-y-auto filter-modal">
        <div className="sticky top-0 bg-[#e7f0dc] border-b-4 border-[#597445] p-4 md:p-6 z-10 rounded-t-[20px]">
          <div className="flex items-center justify-between">
            <h2 className="font-['REM:SemiBold',sans-serif] text-[24px] md:text-[32px] text-[#4f6f52]">
              Filters
            </h2>
            <button
              onClick={onClose}
              className="text-[#597445] hover:opacity-100 transition-opacity text-3xl leading-none"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Price Range */}
          <div>
            <label className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] text-[#4f6f52] block mb-3">
              Price Range
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={localFilters.priceRange[0]}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      priceRange: [
                        parseInt(e.target.value) || 0,
                        localFilters.priceRange[1],
                      ],
                    })
                  }
                  placeholder="Min"
                  className="bg-white border-2 border-[#597445] rounded-[10px] px-4 py-2 w-full text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#79ac78]"
                />
                <span className="text-[#4f6f52]">-</span>
                <input
                  type="number"
                  value={localFilters.priceRange[1]}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      priceRange: [
                        localFilters.priceRange[0],
                        parseInt(e.target.value) || 10000,
                      ],
                    })
                  }
                  placeholder="Max"
                  className="bg-white border-2 border-[#597445] rounded-[10px] px-4 py-2 w-full text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#79ac78]"
                />
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={localFilters.priceRange[1]}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    priceRange: [
                      localFilters.priceRange[0],
                      parseInt(e.target.value),
                    ],
                  })
                }
                className="w-full accent-[#79ac78]"
              />
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] text-[#4f6f52] block mb-3">
              Property Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
              {[
                "Studio",
                "Private Room",
                "Shared Room",
                "Bed Space",
                "Apartment",
              ].map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setLocalFilters({
                      ...localFilters,
                      propertyTypes: toggleArrayFilter(
                        localFilters.propertyTypes,
                        type
                      ),
                    })
                  }
                  className={`px-3 md:px-4 py-2 rounded-[10px] font-['Rethink_Sans:Medium',sans-serif] text-[14px] md:text-[16px] transition-all ${
                    localFilters.propertyTypes.includes(type)
                      ? "bg-[#79ac78] text-white shadow-[0px_0px_10px_0px_rgba(121,172,120,0.5)]"
                      : "bg-white text-[#597445] border-2 border-[#597445]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Gender Preference */}
          <div>
            <label className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] text-[#4f6f52] block mb-3">
              Gender Preference
            </label>
            <div className="flex gap-2 md:gap-3">
              {["Male", "Female", "Any"].map((gender) => (
                <button
                  key={gender}
                  onClick={() =>
                    setLocalFilters({
                      ...localFilters,
                      gender: toggleArrayFilter(localFilters.gender, gender),
                    })
                  }
                  className={`flex-1 px-3 md:px-4 py-2 rounded-[10px] font-['Rethink_Sans:Medium',sans-serif] text-[14px] md:text-[16px] transition-all ${
                    localFilters.gender.includes(gender)
                      ? "bg-[#79ac78] text-white shadow-[0px_0px_10px_0px_rgba(121,172,120,0.5)]"
                      : "bg-white text-[#597445] border-2 border-[#597445]"
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] text-[#4f6f52] block mb-3">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
              {[
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
              ].map((amenity) => (
                <button
                  key={amenity}
                  onClick={() =>
                    setLocalFilters({
                      ...localFilters,
                      amenities: toggleArrayFilter(
                        localFilters.amenities,
                        amenity
                      ),
                    })
                  }
                  className={`px-3 md:px-4 py-2 rounded-[10px] font-['Rethink_Sans:Medium',sans-serif] text-[13px] md:text-[15px] transition-all ${
                    localFilters.amenities.includes(amenity)
                      ? "bg-[#79ac78] text-white shadow-[0px_0px_10px_0px_rgba(121,172,120,0.5)]"
                      : "bg-white text-[#597445] border-2 border-[#597445]"
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] text-[#4f6f52] block mb-3">
              Availability
            </label>
            <div className="flex gap-2 md:gap-3">
              {["Available", "Occupied"].map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    setLocalFilters({
                      ...localFilters,
                      availability: toggleArrayFilter(
                        localFilters.availability,
                        status
                      ),
                    })
                  }
                  className={`flex-1 px-3 md:px-4 py-2 rounded-[10px] font-['Rethink_Sans:Medium',sans-serif] text-[14px] md:text-[16px] transition-all ${
                    localFilters.availability.includes(status)
                      ? "bg-[#79ac78] text-white shadow-[0px_0px_10px_0px_rgba(121,172,120,0.5)]"
                      : "bg-white text-[#597445] border-2 border-[#597445]"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] text-[#4f6f52] block mb-3">
              Rating
            </label>
            <div className="space-y-2">
              {/* First row: 0, 1.0, 1.5, 2.0, 2.5, 3.0 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[0, 1.0, 1.5, 2.0, 2.5, 3.0].map((rating) => (
                  <button
                    key={rating}
                    onClick={() =>
                      setLocalFilters({
                        ...localFilters,
                        rating,
                      })
                    }
                    className={`px-2 py-2 rounded-[10px] font-['Rethink_Sans:Medium',sans-serif] text-[12px] md:text-[14px] transition-all ${
                      localFilters.rating === rating
                        ? "bg-[#79ac78] text-white shadow-[0px_0px_10px_0px_rgba(121,172,120,0.5)]"
                        : "bg-white text-[#597445] border-2 border-[#597445]"
                    }`}
                  >
                    {rating}★
                  </button>
                ))}
              </div>

              {/* Second row: 3.5, 4.0, 4.5, 5.0 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[3.5, 4.0, 4.5, 5.0].map((rating) => (
                  <button
                    key={rating}
                    onClick={() =>
                      setLocalFilters({
                        ...localFilters,
                        rating,
                      })
                    }
                    className={`px-2 py-2 rounded-[10px] font-['Rethink_Sans:Medium',sans-serif] text-[12px] md:text-[14px] transition-all ${
                      localFilters.rating === rating
                        ? "bg-[#79ac78] text-white shadow-[0px_0px_10px_0px_rgba(121,172,120,0.5)]"
                        : "bg-white text-[#597445] border-2 border-[#597445]"
                    }`}
                  >
                    {rating}★
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleReset}
              className="flex-1 bg-white text-[#597445] border-2 border-[#597445] rounded-[15px] px-4 py-3 font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] hover:bg-[#f5f5f5] transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 bg-[#4f6f52] text-white rounded-[15px] px-4 py-3 font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] hover:bg-[#3d5841] transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
