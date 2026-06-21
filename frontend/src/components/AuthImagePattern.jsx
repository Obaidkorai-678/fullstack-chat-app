import { motion } from "framer-motion";

const AuthImagePattern = ({ title, subtitle }) => {
  const words = [
    "Realtime",
    "Voice",
    "Images",
    "Groups",
    "Online",
    "Secure",
    "Media",
    "Instant",
    "Connected",
  ];

  return (
    <div className="relative hidden items-center justify-center overflow-hidden bg-base-200 p-12 lg:flex">
      {/* ambient glow */}
      <div className="glow-blob animate-float-slow -left-10 top-10 size-80 bg-primary" />
      <div className="glow-blob animate-float-slow-2 -right-10 bottom-10 size-72 bg-secondary" />

      <div className="relative z-10 max-w-md text-center">
        {/* Feature grid */}
        <div className="mb-10 grid grid-cols-3 gap-4">
          {words.map((word, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="glass flex aspect-square items-center justify-center rounded-3xl text-sm font-semibold text-base-content/80 shadow-md lift hover:bg-primary hover:text-primary-content"
            >
              {word}
            </motion.div>
          ))}
        </div>

        <h2 className="font-display text-3xl font-extrabold text-balance">
          {title}
        </h2>
        <p className="mt-4 text-pretty leading-relaxed text-base-content/65">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
