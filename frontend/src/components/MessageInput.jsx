import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useGroupStore } from "../store/useGroupStore";
import { useAuthStore } from "../store/useAuthStore";
import { Image, Send, X, Mic } from "lucide-react";
import toast from "react-hot-toast";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";

const MessageInput = ({ isGroup = false }) => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);
  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);

  const {
    selectedUser, sendMessage, emitTyping, emitStopTyping,
  } = useChatStore();
  const {
    selectedGroup, sendGroupMessage, joinGroupRoom,
  } = useGroupStore();
  const { authUser } = useAuthStore();

  const prefs = authUser?.preferences || {};
  const enterToSend = prefs.enterToSend !== false;

  const {
    startRecording, stopRecording, cancelRecording, isRecording,
  } = useVoiceRecorder();

  const activeChatId = isGroup ? selectedGroup?._id : selectedUser?._id;
  const emitTypingNow = () => {
    if (!activeChatId) return;
    emitTyping(activeChatId, isGroup);
    isTypingRef.current = true;
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      emitStopTyping(activeChatId, isGroup);
      isTypingRef.current = false;
    }, 2500);
  };

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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ================= SEND MESSAGE =================
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    const formData = new FormData();
    formData.append("text", text.trim());
    formData.append("isGroup", isGroup ? "true" : "false");

    if (imagePreview) {
      const byteString = atob(imagePreview.split(",")[1]);
      const mimeString = imagePreview.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      const blob = new Blob([ab], { type: mimeString });
      formData.append("file", blob, "image.jpg");
    }

  if (isGroup) {
  await sendGroupMessage(activeChatId, formData);
} else {
  await sendMessage(formData);
}

    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (isTypingRef.current) {
      emitStopTyping(activeChatId, isGroup);
      isTypingRef.current = false;
    }
  };

  // ================= TEXT CHANGE =================
  const handleTextChange = (e) => {
    const val = e.target.value;
    setText(val);
    if (prefs.showTypingIndicators !== false) emitTypingNow();
  };

  const handleKeyDown = (e) => {
    if (prefs.enterToSend !== false && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
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
      formData.append("file", audioBlob, "voice.webm");
      formData.append("isGroup", isGroup ? "true" : "false");

      if (isGroup) {
        await sendGroupMessage(activeChatId, formData);
      } else {
        await sendMessage(formData);
      }
    } catch (err) {
      console.error(err);
      toast.error("Voice failed");
    }
  };

  return (
    <div className="glass border-t border-base-content/5 p-3 sm:p-4">
      {/* IMAGE PREVIEW */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-3">
          <div className="relative">
            <img
              src={imagePreview}
              className="size-20 rounded-2xl border border-base-content/10 object-cover shadow-md"
              alt="preview"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-base-300 text-base-content shadow-md transition-transform hover:scale-110"
              aria-label="Remove image"
            >
              <X className="size-3.5" />
            </button>
          </div>
          <span className="text-xs text-base-content/50">Image ready to send</span>
        </div>
      )}

      {/* RECORDING UI */}
      {isRecording && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-error/10 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 font-semibold text-error">
              <span className="size-2.5 animate-pulse rounded-full bg-error" />
              Recording…
            </span>
            <div className="flex h-6 items-end gap-1">
              <div className="w-1 animate-bounce rounded bg-error" style={{ height: "40%" }} />
              <div className="w-1 animate-pulse rounded bg-error" style={{ height: "80%" }} />
              <div className="w-1 animate-bounce rounded bg-error" style={{ height: "55%" }} />
              <div className="w-1 animate-pulse rounded bg-error" style={{ height: "100%" }} />
              <div className="w-1 animate-bounce rounded bg-error" style={{ height: "65%" }} />
            </div>
          </div>
          <button
            type="button"
            onClick={cancelRecording}
            className="rounded-xl bg-error px-3 py-1.5 text-sm font-medium text-error-content transition-transform hover:scale-105"
          >
            Cancel
          </button>
        </div>
      )}

      {/* INPUT BAR */}
     <form
  onSubmit={handleSendMessage}
  className="flex items-center gap-2 rounded-3xl border border-base-content/10 bg-base-200/60 p-1.5 pl-4 shadow-sm"
>
        <input
          type="text"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-base-content/40"
          placeholder="Type a message…"
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
        />

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <div className="flex flex-shrink-0 items-center gap-1">
          <button
            type="button"
            className="grid size-10 place-items-center rounded-2xl text-base-content/60 transition-all hover:bg-base-content/10 hover:text-base-content"
            onClick={() => fileInputRef.current.click()}
            aria-label="Attach image"
          >
            <Image size={19} />
          </button>

          <button
            type="button"
            onClick={handleVoice}
            aria-label="Record voice message"
            className={`grid size-10 place-items-center rounded-2xl transition-all ${
              isRecording
                ? "animate-pulse bg-error text-error-content"
                : "text-base-content/60 hover:bg-base-content/10 hover:text-base-content"
            }`}
          >
            <Mic size={19} />
          </button>

          <button
            type="submit"
            disabled={!text.trim() && !imagePreview}
            aria-label="Send message"
            className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-content shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;