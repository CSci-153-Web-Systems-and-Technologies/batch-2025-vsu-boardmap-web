import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-b from-[#e2f0d1] to-[#ffffff] via-[#e8f3da] flex items-center justify-center z-50"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="bg-[#4f6f52] rounded-[12px] size-[60px] flex items-center justify-center"
          >
            <svg className="size-[40px]" fill="none" viewBox="0 0 37 37">
              <path
                d="M6.207 15.603L18.603 6.207L31 15.603V30.793H6.207V15.603Z"
                stroke="#F5F5F5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
              />
            </svg>
          </motion.div>
          <h1 className="font-['REM:SemiBold',sans-serif] text-[40px] text-[#4f6f52]">
            BoardMap
          </h1>
        </motion.div>

        {/* Loading Bar */}
        <div className="w-[300px] h-[6px] bg-white rounded-full overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-full bg-[#79ac78] rounded-full"
            style={{ width: '50%' }}
          />
        </div>

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-['Rethink_Sans:Medium',sans-serif] text-[18px] text-[#597445]"
        >
          Finding your perfect boarding house...
        </motion.p>
      </div>
    </motion.div>
  );
}
