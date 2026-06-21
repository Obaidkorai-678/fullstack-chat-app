import { MessageSquare, Zap, Mic, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Zap, label: "Realtime" },
  { icon: Mic, label: "Voice Notes" },
  { icon: ImageIcon, label: "Image Sharing" },
];

const NoChatSelected = () => {
  return (
    <div className="flex min-h-full w-full flex-1 items-center justify-center bg-base-200/20 px-4 py-8 sm:px-6 md:px-10 lg:px-16 xl:px-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mx-auto w-full max-w-3xl text-center"
      >
        {/* ICON */}
        <div className="mb-6 flex justify-center sm:mb-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-primary/30 blur-3xl" />

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                relative
                grid
                place-items-center
                rounded-[2rem]
                bg-primary/15
                ring-1
                ring-primary/20

                size-20
                sm:size-24
                md:size-28
                lg:size-32
              "
            >
              <MessageSquare
                className="
                  text-primary
                  size-9
                  sm:size-10
                  md:size-12
                  lg:size-14
                "
              />
            </motion.div>
          </div>
        </div>

        {/* TITLE */}
        <h2
          className="
            font-display
            font-extrabold
            leading-tight
            text-2xl
            sm:text-3xl
            md:text-4xl
            lg:text-5xl
          "
        >
          Welcome to{" "}
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            ChatApp
          </span>
        </h2>

        {/* DESCRIPTION */}
        <p
          className="
            mx-auto
            mt-4
            max-w-2xl
            leading-relaxed
            text-base-content/60
            text-sm
            sm:text-base
            md:text-lg
          "
        >
          Select a conversation from the sidebar to start chatting,
          share voice notes, exchange images, and enjoy seamless
          realtime messaging across all your devices.
        </p>

        {/* FEATURES */}
        <div
          className="
            mt-8
            flex
            flex-wrap
            justify-center
            gap-3
            sm:gap-4
          "
        >
          {features.map((feature) => (
            <motion.div
              key={feature.label}
              whileHover={{ y: -3 }}
              className="
                flex
                items-center
                gap-2
                rounded-2xl
                border
                border-base-content/10
                bg-base-100/70
                backdrop-blur-sm
                px-4
                py-2.5
                sm:px-5
                sm:py-3
                text-sm
                sm:text-base
                text-base-content/70
                shadow-sm
              "
            >
              <feature.icon className="size-4 sm:size-5 text-primary" />
              <span>{feature.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-10">
          <p className="text-xs sm:text-sm text-base-content/40">
            Fast • Secure • Realtime Messaging
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default NoChatSelected;