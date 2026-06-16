
import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Mic } from "lucide-react";
import toast from "react-hot-toast";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  const { sendMessage } = useChatStore();

  // 🎤 VOICE RECORDER HOOK
  const { startRecording, stopRecording, isRecording } =
    useVoiceRecorder();

  // ================= IMAGE =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ================= TEXT SEND =================
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);

      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // ================= VOICE SEND =================
  const handleVoice = async () => {
    try {
      if (!isRecording) {
        startRecording();
        return;
      }

      const audioBlob = await stopRecording();

      if (!audioBlob) return;

      const formData = new FormData();
      formData.append("audio", audioBlob, "voice.webm");

      await sendMessage(formData);

    } catch (error) {
      console.error("Voice error:", error);
    }
  };

  return (
    <div className="p-4 w-full">

      {/* ================= IMAGE PREVIEW ================= */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* ================= INPUT ================= */}
      {isRecording && (
        <div className="mb-3 flex items-center gap-3">
          <span className="text-red-500 font-semibold animate-pulse">
            ● Recording...
          </span>

          <div className="flex items-end gap-1 h-8">
            <div className="w-1 h-3 bg-red-500 rounded animate-pulse"></div>
            <div className="w-1 h-6 bg-red-500 rounded animate-bounce"></div>
            <div className="w-1 h-4 bg-red-500 rounded animate-pulse"></div>
            <div className="w-1 h-8 bg-red-500 rounded animate-bounce"></div>
            <div className="w-1 h-5 bg-red-500 rounded animate-pulse"></div>
            <div className="w-1 h-7 bg-red-500 rounded animate-bounce"></div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="
    flex
    items-center
    gap-2
    w-full
  "
      >

        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="
    flex-1
    input
    input-bordered
    rounded-full
    input-sm
    sm:input-md
  "
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* IMAGE BUTTON */}
          <button
            type="button"
            className="hidden sm:flex btn btn-circle text-zinc-400"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>

          {/* 🎤 VOICE BUTTON */}
          <button
            type="button"
            onClick={handleVoice}
            className={`
    btn btn-circle
    ${isRecording
                ? "bg-red-500 border-red-500 text-white animate-pulse"
                : "text-zinc-400"}
  `}
          >
            <Mic size={22} />
          </button>
        </div>

        {/* SEND BUTTON */}
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;