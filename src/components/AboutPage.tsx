import { motion } from 'framer-motion';

function Home() {
  return (
    <div className="[grid-area:1_/_1] ml-[6.207px] mt-[6.207px] relative size-[36.207px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37 37">
        <g id="Home">
          <path d={svgPaths.p3ffc9300} id="Icon" stroke="var(--stroke-0, #F5F5F5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        </g>
      </svg>
    </div>
  );
}

function IconLogo() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0"
      data-name="Icon Logo"
    >
      {/* Remove the green background circle and use your logo instead */}
      <img
        src="/BoardMap_Logo_White.png"
        alt="BoardMap Logo"
        className="w-[50px] h-[50px] object-contain"
      />
    </div>
  );
}

interface AboutPageProps {
  onClose: () => void;
}

export default function AboutPage({ onClose }: AboutPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-[#e7f0dc] rounded-[20px] max-w-4xl w-full shadow-[0px_0px_40px_0px_rgba(89,116,69,0.4)] max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-[#597445] rounded-t-[20px] p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <IconLogo />
            <h2 className="font-['REM:SemiBold',sans-serif] text-[28px] md:text-[36px] text-white">About Us</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:opacity-70 transition-opacity p-2"
          >
            <svg className="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 md:p-10 space-y-8">
          {/* Mission */}
          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-['REM:SemiBold',sans-serif] text-[24px] text-[#4f6f52] mb-4">Our Mission</h3>
            <p className="font-['Rethink_Sans:Regular',sans-serif] text-[16px] text-[#597445] leading-relaxed">
              BoardMap aims to simplify the process of finding quality boarding houses for students of Visayas State University. 
              We connect students with reliable property owners, making the transition to university life smoother and more convenient.
            </p>
          </motion.section>

          {/* What We Offer */}
          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-['REM:SemiBold',sans-serif] text-[24px] text-[#4f6f52] mb-4">What We Offer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Interactive Map', desc: 'Easily locate boarding houses around VSU campus with our interactive map feature.' },
                { title: 'Real-time Updates', desc: 'Get instant notifications about availability, pricing, and new listings.' },
                { title: 'Direct Communication', desc: 'Message property owners directly through our platform for quick inquiries.' },
                { title: 'Verified Listings', desc: 'All properties are verified to ensure quality and authenticity.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-5 rounded-[15px] border-2 border-[#79ac78]">
                  <h4 className="font-['Rethink_Sans:SemiBold',sans-serif] text-[18px] text-[#4f6f52] mb-2">
                    {item.title}
                  </h4>
                  <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] text-[#597445]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Why Choose Us */}
          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-['REM:SemiBold',sans-serif] text-[24px] text-[#4f6f52] mb-4">Why Choose BoardMap?</h3>
            <ul className="space-y-3">
              {[
                'Comprehensive listings of boarding houses near VSU',
                'User-friendly interface designed for students',
                'Safe and secure platform for communication',
                'Regularly updated property information',
                'Helpful filters to find exactly what you need',
                'Community-driven reviews and ratings',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="bg-[#79ac78] rounded-full p-1 mt-1">
                    <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-['Rethink_Sans:Regular',sans-serif] text-[16px] text-[#597445]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Statistics */}
          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-[#79ac78] rounded-[15px] p-6 md:p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-white">
              <div>
                <p className="font-['Rethink_Sans:ExtraBold',sans-serif] text-[36px]">500+</p>
                <p className="font-['Rethink_Sans:Medium',sans-serif] text-[16px]">Properties Listed</p>
              </div>
              <div>
                <p className="font-['Rethink_Sans:ExtraBold',sans-serif] text-[36px]">2,000+</p>
                <p className="font-['Rethink_Sans:Medium',sans-serif] text-[16px]">Students Helped</p>
              </div>
              <div>
                <p className="font-['Rethink_Sans:ExtraBold',sans-serif] text-[36px]">4.8★</p>
                <p className="font-['Rethink_Sans:Medium',sans-serif] text-[16px]">Average Rating</p>
              </div>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </motion.div>
  );
}
