import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-b from-[#e2f0d1] to-[#ffffff] via-[#e8f3da] flex items-center justify-center z-50"
    >
      <div className="flex flex-col items-center gap-10">
        {/* Logo and Text with Enhanced Wave Animation */}
        <div className="flex items-center gap-3">
          {/* Logo with enhanced pulsing animation */}
          <motion.div
            initial={{ scale: 0.85 }}
            animate={{ 
              scale: [0.85, 1.15, 0.85],
              rotate: [-5, 5, -5],
              y: [0, -5, 0]
            }}
            transition={{ 
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex items-center justify-center"
          >
            <img
              src="/BoardMap_Logo.png"
              alt="BoardMap Logo"
              className="w-[50px] h-[50px] object-contain rounded-[12px] shadow-lg"
            />
          </motion.div>

          {/* Text with enhanced wave animation - like ocean waves */}
          <div className="flex items-center relative">
            {["B", "o", "a", "r", "d", "M", "a", "p"].map((letter, index) => (
              <motion.span
                key={index}
                initial={{ y: 0, opacity: 0.7 }}
                animate={{ 
                  y: [0, -12, 8, -4, 0],
                  opacity: [0.7, 1, 0.9, 1, 0.7],
                  scale: [1, 1.15, 0.95, 1.1, 1]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: index * 0.15,
                  times: [0, 0.25, 0.5, 0.75, 1],
                  ease: "easeInOut"
                }}
                className="font-['REM:SemiBold',sans-serif] text-[80px] text-[#4f6f52] inline-block drop-shadow-sm"
                style={{
                  textShadow: '0 2px 4px rgba(79, 111, 82, 0.2)'
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Enhanced Loading Wave Bar */}
        <div className="flex flex-col items-center gap-6 w-[400px]">
          {/* Wave-like loading bar */}
          <div className="relative w-full h-[12px] rounded-full overflow-hidden">
            {/* Background wave */}
            <motion.div
              animate={{ 
                x: [0, 400, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4f6f52]/20 to-transparent"
            />
            
            {/* Main loading wave */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="h-full relative"
            >
              {/* Wave shape */}
              <svg
                className="absolute top-0 left-0 w-[100px] h-full"
                viewBox="0 0 100 12"
                fill="none"
              >
                <motion.path
                  animate={{ d: [
                    "M0,6 C20,0 30,12 50,6 C70,0 80,12 100,6",
                    "M0,6 C20,12 30,0 50,6 C70,12 80,0 100,6",
                    "M0,6 C20,0 30,12 50,6 C70,0 80,12 100,6"
                  ] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  fill="url(#gradient)"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4f6f52" />
                    <stop offset="50%" stopColor="#79ac78" />
                    <stop offset="100%" stopColor="#4f6f52" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          </div>

          {/* Animated dots with wave effect */}
          <div className="flex items-center gap-3">
            {[0, 1, 2, 3, 4].map((dot) => (
              <motion.div
                key={dot}
                initial={{ y: 0, scale: 0.6 }}
                animate={{ 
                  y: [0, -8, 0, 4, 0],
                  scale: [0.6, 1.2, 0.8, 1.1, 0.6]
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: dot * 0.2,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <div className="w-[10px] h-[10px] bg-gradient-to-br from-[#4f6f52] to-[#79ac78] rounded-full shadow-md" />
                {/* Glow effect */}
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: dot * 0.2 }}
                  className="absolute inset-0 w-full h-full bg-[#4f6f52] rounded-full blur-sm"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Loading Text with wave effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-3"
        >
          {/* Main loading text with wave */}
          <div className="flex items-center gap-1">
            {["Finding your perfect boarding house"].map((char, index) => (
              <motion.span
                key={index}
                initial={{ y: 0 }}
                animate={{ 
                  y: char === ' ' ? 0 : [0, -3, 0],
                  opacity: char === ' ' ? 1 : [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: index * 0.05,
                  ease: "easeInOut"
                }}
                className={`font-['Rethink_Sans:Medium',sans-serif] text-[22px] ${
                  char === ' ' ? 'w-1' : 'text-[#597445]'
                }`}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Subtext with pulsing dots */}
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="font-['Rethink_Sans:Regular',sans-serif] text-[16px] text-[#597445]/80 flex items-center gap-1"
          >
            Loading the best options
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              className="inline-block"
            >
              .
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              className="inline-block"
            >
              .
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              className="inline-block"
            >
              .
            </motion.span>
            near VSU
          </motion.p>
        </motion.div>

        {/* Subtle floating elements in background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                opacity: 0
              }}
              animate={{ 
                y: [0, -20, 0],
                opacity: [0, 0.1, 0],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "linear"
              }}
              className="absolute w-[20px] h-[20px] rounded-full bg-[#4f6f52]/10"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}