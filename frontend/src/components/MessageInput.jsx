
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

  const {
    startRecording,
    stopRecording,
    cancelRecording,
    isRecording,
  } = useVoiceRecorder();

  // ================= IMAGE =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    fileInputRef.current.value = "";
  };

  // ================= TEXT SEND =================
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imagePreview) return;

    await sendMessage({
      text: text.trim(),
      image: imagePreview,
    });

    setText("");
    setImagePreview(null);
    fileInputRef.current.value = "";
  };

  // ================= VOICE =================
  const handleVoice = async () => {
    try {
      if (!isRecording) {
        await startRecording();
        return;
      }

      const audioBlob = await stopRecording();
      if (!audioBlob) return;

      const formData = new FormData();
      formData.append("audio", audioBlob, "voice.webm");

      await sendMessage(formData);
    } catch (err) {
      console.error(err);
      toast.error("Voice failed");
    }
  };

  return (
    <div className="p-3 sm:p-4 w-full">

      {/* ================= IMAGE PREVIEW ================= */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border"
            />

            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-5 h-5 bg-base-300 rounded-full flex items-center justify-center"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* ================= RECORDING UI ================= */}
      {isRecording && (
        <div className="mb-3 flex items-center justify-between flex-wrap gap-3">

          {/* LEFT */}
          <div className="flex items-center gap-3">
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

          {/* RIGHT CANCEL */}
          <button
            type="button"
            onClick={cancelRecording}
            className="btn btn-sm btn-error"
          >
            Cancel
          </button>
        </div>
      )}

      {/* ================= INPUT ================= */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 w-full"
      >
        <input
          type="text"
          className="flex-1 input input-bordered rounded-full"
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

        {/* IMAGE */}
        <button
          type="button"
          className="btn btn-circle hidden sm:flex"
          onClick={() => fileInputRef.current.click()}
        >
          <Image size={18} />
        </button>

        {/* VOICE */}
        <button
          type="button"
          onClick={handleVoice}
          className={`btn btn-circle ${
            isRecording
              ? "bg-red-500 text-white animate-pulse"
              : "text-zinc-400"
          }`}
        >
          <Mic size={20} />
        </button>

        {/* SEND */}
        <button
          type="submit"
          className="btn btn-circle btn-sm"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;