import { MessageSquare, Zap, Mic, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Zap, label: "Realtime" },
  { icon: Mic, label: "Voice notes" },
  { icon: ImageIcon, label: "Image sharing" },
];

const NoChatSelected = () => {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center bg-base-200/30 p-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md text-center"
      >
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-4xl bg-primary/30 blur-2xl" />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative grid size-20 place-items-center rounded-4xl bg-primary/15 ring-1 ring-primary/20"
            >
              <MessageSquare className="size-9 text-primary" />
            </motion.div>
          </div>
        </div>

        <h2 className="font-display text-2xl font-extrabold text-balance">
          Welcome to <span className="text-gradient">ChatApp</span>
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-pretty leading-relaxed text-base-content/60">
          Select a conversation from the sidebar to start chatting, share voice
          notes, and send images in realtime.
        </p>

        {/* Feature pills */}
        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          {features.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2 rounded-2xl border border-base-content/10 bg-base-100/60 px-3.5 py-2 text-sm text-base-content/70 lift"
            >
              <f.icon className="size-4 text-primary" />
              {f.label}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default NoChatSelected;
