import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Type, Loader as Loader2, Send } from "lucide-react";
import { useStatusStore } from "../store/useStatusStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const PALETTES = [
  "linear-gradient(135deg,#0f172a,#1e40af)",
  "linear-gradient(135deg,#1f2937,#7c3aed)",
  "linear-gradient(135deg,#0f2e1e,#16a34a)",
  "linear-gradient(135deg,#2d1b1b,#dc2626)",
  "linear-gradient(135deg,#1b1b2d,#2563eb)",
];

const CreateStatusModal = ({ isOpen, onClose }) => {
  const { createStatus, isUploading } = useStatusStore();
  const { authUser } = useAuthStore();

  const [type, setType] = useState("text");
  const [text, setText] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [paletteIdx, setPaletteIdx] = useState(0);

  const fileInputRef = useRef(null);

  const reset = () => {
    setType("text");
    setText("");
    setCaption("");
    setImage(null);
    setPaletteIdx(0);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Select an image");
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handlePost = async () => {
    if (type === "text" && !text.trim()) return toast.error("Write something");
    if (type === "image" && !image) return toast.error("Select an image");
    const payload =
      type === "text"
        ? { type: "text", content: text.trim(), caption, background: String(paletteIdx) }
        : { type: "image", content: image, caption };
    const result = await createStatus(payload);
    if (result) {
      reset();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="panel w-full max-w-md overflow-hidden rounded-4xl"
          >
            <div className="flex items-center justify-between border-b border-base-content/8 p-5">
              <h2 className="font-display text-lg font-bold">Add Status</h2>
              <button
                onClick={onClose}
                className="grid size-8 place-items-center rounded-xl hover:bg-base-content/10"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* type toggle */}
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-base-200/60 p-1">
                <button
                  onClick={() => setType("text")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all ${
                    type === "text" ? "bg-primary text-primary-content shadow" : "text-base-content/60"
                  }`}
                >
                  <Type className="size-4" /> Text
                </button>
                <button
                  onClick={() => setType("image")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all ${
                    type === "image" ? "bg-primary text-primary-content shadow" : "text-base-content/60"
                  }`}
                >
                  <ImageIcon className="size-4" /> Image
                </button>
              </div>

              {/* preview */}
              {type === "text" ? (
                <div>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What's on your mind?"
                    rows={5}
                    className="w-full resize-none rounded-2xl border border-base-content/10 bg-base-200/60 p-4 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    maxLength={400}
                  />
                  <div className="mt-3 flex gap-2">
                    {PALETTES.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => setPaletteIdx(i)}
                        className={`size-8 rounded-xl border-2 transition-all ${
                          paletteIdx === i ? "border-primary scale-110" : "border-transparent"
                        }`}
                        style={{ background: p }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {image ? (
                    <div className="relative">
                      <img src={image} alt="preview" className="max-h-64 w-full rounded-2xl object-cover" />
                      <button
                        onClick={() => setImage(null)}
                        className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-black/50 text-white"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-base-content/15 py-12 text-base-content/50 hover:border-primary/40 hover:text-primary"
                    >
                      <ImageIcon className="size-8" />
                      <span className="text-sm">Click to upload image</span>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImage}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Caption (optional)</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption"
                  maxLength={160}
                  className="w-full rounded-2xl border border-base-content/10 bg-base-200/60 py-3 px-4 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <button
                onClick={handlePost}
                disabled={isUploading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 font-semibold text-primary-content shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="size-5 animate-spin" /> Uploading…
                  </>
                ) : (
                  <>
                    <Send className="size-5" /> Post Status
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateStatusModal;