import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages = [],
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // ================= LOAD MESSAGES =================
  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessages(selectedUser._id);

    if (typeof subscribeToMessages === "function") {
      subscribeToMessages();
    }

    return () => {
      if (typeof unsubscribeFromMessages === "function") {
        unsubscribeFromMessages();
      }
    };
  }, [
    selectedUser?._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ================= LOADING =================
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
<div className="flex-1 min-w-0 flex flex-col overflow-auto">      <ChatHeader />

      {/* ================= MESSAGES ================= */}
      <div
  className="
    flex-1
    overflow-y-auto
    px-2
    sm:px-4
    py-3
    space-y-4
  "
>
        {messages.map((message, index) => {
          const isOwn = message.senderId === authUser?._id;

          return (
            <div
              key={message._id || index}
              className={`chat ${isOwn ? "chat-end" : "chat-start"}`}
              ref={index === messages.length - 1 ? messageEndRef : null}
            >

              {/* AVATAR */}
              <div className="chat-image avatar hidden sm:block">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      isOwn
                        ? authUser?.profilePic || "/avatar.png"
                        : selectedUser?.profilePic || "/avatar.png"
                    }
                    alt="profile"
                  />
                </div>
              </div>

              {/* TIME */}
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              {/* MESSAGE BUBBLE */}
              <div className="chat-bubble flex flex-col">

                {/* IMAGE */}
                {message.image && (
                  <img
                    src={message.image}
                    alt="attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}

                {/* TEXT */}
                {message.text && <p>{message.text}</p>}

  

{/* medium vioce note */}
{message.audio && (
  <div
    className={`
      flex items-center gap-2
      rounded-2xl
      px-3 py-2
      w-full
      max-w-[420px]
      overflow-visible
      ${isOwn ? "bg-primary text-primary-content" : "bg-pink-300"}
    `}
  >
    <div className="text-lg shrink-0">🎤</div>

    <audio
      controls
      preload="metadata"
      src={message.audio}
      className="flex-1 min-w-0"
    />
  </div>
)}
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;