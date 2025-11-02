import { motion } from "framer-motion";
import { useState } from "react";
import svgPaths from "../imports/svg-0x5486gjrj";

function Home() {
  return (
    <div className="[grid-area:1_/_1] ml-[6.207px] mt-[6.207px] relative size-[36.207px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 37 37"
      >
        <g id="Home">
          <path
            d={svgPaths.p3ffc9300}
            id="Icon"
            stroke="var(--stroke-0, #F5F5F5)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
        </g>
      </svg>
    </div>
  );
}

function IconLogo() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] bg-[#4f6f52] ml-0 mt-0 rounded-[12px] size-[49.208px]" />
      <Home />
    </div>
  );
}

interface ContactPageProps {
  onClose: () => void;
}

export default function ContactPage({ onClose }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission to backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

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
            <h2 className="font-['REM:SemiBold',sans-serif] text-[28px] md:text-[36px] text-white">
              Contact Us
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:opacity-70 transition-opacity p-2"
          >
            <svg
              className="size-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-['REM:SemiBold',sans-serif] text-[24px] text-[#4f6f52] mb-4">
                Get in Touch
              </h3>
              <p className="font-['Rethink_Sans:Regular',sans-serif] text-[16px] text-[#597445] mb-6">
                Have questions? We'd love to hear from you. Send us a message
                and we'll respond as soon as possible.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-white p-4 rounded-[15px]">
                <div className="bg-[#79ac78] p-3 rounded-full">
                  <svg
                    className="size-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] text-[#4f6f52] mb-1">
                    Email
                  </h4>
                  <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] text-[#597445]">
                    support.boardmap@gmail.com{" "}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white p-4 rounded-[15px]">
                <div className="bg-[#79ac78] p-3 rounded-full">
                  <svg
                    className="size-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] text-[#4f6f52] mb-1">
                    Phone
                  </h4>
                  <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] text-[#597445]">
                    +63 915 211 1698
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white p-4 rounded-[15px]">
                <div className="bg-[#79ac78] p-3 rounded-full">
                  <svg
                    className="size-6 text-white"
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
                </div>
                <div>
                  <h4 className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] text-[#4f6f52] mb-1">
                    Address
                  </h4>
                  <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] text-[#597445]">
                    Visayas State University
                    <br />
                    Baybay City, Leyte 6521-A
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="font-['Rethink_Sans:Medium',sans-serif] text-[14px] text-[#4f6f52] block mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full bg-white border-2 border-[#597445] rounded-[10px] px-4 py-3 font-['Rethink_Sans:Regular',sans-serif] text-[14px] text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#79ac78]"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="font-['Rethink_Sans:Medium',sans-serif] text-[14px] text-[#4f6f52] block mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full bg-white border-2 border-[#597445] rounded-[10px] px-4 py-3 font-['Rethink_Sans:Regular',sans-serif] text-[14px] text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#79ac78]"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="font-['Rethink_Sans:Medium',sans-serif] text-[14px] text-[#4f6f52] block mb-2">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                required
                className="w-full bg-white border-2 border-[#597445] rounded-[10px] px-4 py-3 font-['Rethink_Sans:Regular',sans-serif] text-[14px] text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#79ac78]"
                placeholder="What is this about?"
              />
            </div>

            <div>
              <label className="font-['Rethink_Sans:Medium',sans-serif] text-[14px] text-[#4f6f52] block mb-2">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
                rows={5}
                className="w-full bg-white border-2 border-[#597445] rounded-[10px] px-4 py-3 font-['Rethink_Sans:Regular',sans-serif] text-[14px] text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#79ac78] resize-none"
                placeholder="Your message..."
              />
            </div>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#79ac78] text-white text-center py-3 rounded-[15px] font-['Rethink_Sans:SemiBold',sans-serif]"
              >
                Message sent successfully! ✓
              </motion.div>
            ) : (
              <button
                type="submit"
                className="w-full bg-[#4f6f52] text-white py-3 rounded-[15px] font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] hover:bg-[#3d5841] transition-colors"
              >
                Send Message
              </button>
            )}
          </motion.form>
        </div>
      </motion.div>
    </motion.div>
  );
}
