import svgPaths from "../imports/svg-0x5486gjrj";

function Home() {
  return (
    <div className="[grid-area:1_/_1] ml-[5.172px] mt-[5.172px] relative size-[30.172px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31 31">
        <g id="Home">
          <path d={svgPaths.p3ffc9300} id="Icon" stroke="var(--stroke-0, #597445)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        </g>
      </svg>
    </div>
  );
}

function IconLogo() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <div className="[grid-area:1_/_1] bg-[#f3f3f3] ml-0 mt-0 rounded-[10px] size-[41.007px]" />
      <Home />
    </div>
  );
}

function LogoWithText() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <IconLogo />
      <div className="[grid-area:1_/_1] flex flex-col font-['REM:SemiBold',sans-serif] font-semibold h-[31.035px] justify-center ml-[120.69px] mt-[21.553px] relative text-[#f3f3f3] text-[20px] md:text-[28px] text-center translate-x-[-50%] translate-y-[-50%] w-[158.621px]">
        <p className="leading-[normal]">BoardMap</p>
      </div>
    </div>
  );
}

function MarkEmailUnread() {
  return (
    <div className="relative shrink-0 size-[18px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="mark_email_unread">
          <path d={svgPaths.p13b02200} fill="var(--fill-0, #F3F3F3)" id="icon" />
        </g>
      </svg>
    </div>
  );
}

function PhoneIcon() {
  return (
    <div className="h-[11.336px] relative shrink-0 w-[11.314px]">
      <div className="absolute inset-[-17.64%_-17.68%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <path d={svgPaths.p25587780} id="Icon" stroke="var(--stroke-0, #F3F3F3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        </svg>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <div className="bg-[#597445] box-border w-full py-6 md:py-[24px] px-4 md:px-[24px]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-[220px]">
          {/* Logo */}
          <div className="content-stretch flex flex-col gap-[10px] items-start w-full md:w-[319px]">
            <LogoWithText />
            <p className="font-['Rethink_Sans:Regular',sans-serif] font-normal leading-normal text-[14px] md:text-[16px] text-white">
              Connecting VSU students with quality boarding houses in the surrounding barangays.
            </p>
          </div>

          {/* For Students */}
          <div className="content-stretch flex flex-col gap-[10px] md:gap-[20px] items-start w-full md:w-[183px]">
            <p className="font-['Rethink_Sans:Bold',sans-serif] font-bold leading-normal text-[18px] md:text-[20px] text-white">For Students</p>
            <div className="content-stretch flex flex-col font-['Rethink_Sans:Regular',sans-serif] font-normal gap-[2px] items-start leading-normal text-[14px] md:text-[16px] text-white w-full">
              <p>Find Boarding Houses</p>
              <p>Browse by Location</p>
              <p>Compare Prices</p>
              <p>Read Reviews</p>
            </div>
          </div>

          {/* For Owner */}
          <div className="content-stretch flex flex-col gap-[10px] md:gap-[20px] items-start w-full md:w-[183px]">
            <p className="font-['Rethink_Sans:Bold',sans-serif] font-bold leading-normal text-[18px] md:text-[20px] text-white">For Owner</p>
            <div className="content-stretch flex flex-col font-['Rethink_Sans:Regular',sans-serif] font-normal gap-[2px] items-start leading-normal text-[14px] md:text-[16px] text-white w-full">
              <p>List Your Property</p>
              <p>Manage Bookings</p>
              <p>Connect with Students</p>
              <p>Update Availability</p>
            </div>
          </div>

          {/* Contact us */}
          <div className="content-stretch flex flex-col gap-[10px] md:gap-[20px] items-start w-full md:w-[271px]">
            <p className="font-['Rethink_Sans:Bold',sans-serif] font-bold leading-normal text-[18px] md:text-[20px] text-white">Contact us</p>
            <div className="content-stretch flex flex-col gap-[4px] items-start w-full">
              <a 
                href="mailto:support.boardmap@vsu.edu.ph"
                className="content-stretch flex items-center gap-2 w-full hover:opacity-80 transition-opacity cursor-pointer group"
              >
                <MarkEmailUnread />
                <p className="font-['Rethink_Sans:Regular',sans-serif] font-normal leading-normal text-[14px] md:text-[16px] text-white group-hover:underline">
                  support.boardmap@vsu.edu.ph
                </p>
              </a>
              <a
                href="tel:+639152111698"
                className="content-stretch flex gap-[7px] items-center w-full hover:opacity-80 transition-opacity cursor-pointer group"
              >
                <PhoneIcon />
                <p className="font-['Rethink_Sans:Regular',sans-serif] font-normal leading-normal text-[14px] md:text-[16px] text-white group-hover:underline">
                  +63 915 211 1698
                </p>
              </a>
            </div>
          </div>
        </div>

        {/* Divider and Copyright */}
        <div className="content-stretch flex flex-col gap-[13px] items-center mt-8 md:mt-12 w-full">
          <div className="h-0 w-full border-t border-[#79AC78]" />
          <p className="font-['Rethink_Sans:Medium',sans-serif] font-medium leading-normal text-[14px] md:text-[16px] text-center text-white">
            © 2025 VSU BoardMap. Created by Christian Earl James N. Boyles. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
