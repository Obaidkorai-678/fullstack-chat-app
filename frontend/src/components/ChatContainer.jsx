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
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-base-200/30">
      <ChatHeader />

      {/* ================= MESSAGES ================= */}
      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-5 sm:px-6">
        {messages.map((message, index) => {
          const isOwn = message.senderId === authUser?._id;

          return (
            <div
              key={message._id || index}
              className={`flex animate-bubble-in items-end gap-2.5 ${
                isOwn ? "flex-row-reverse" : "flex-row"
              }`}
              ref={index === messages.length - 1 ? messageEndRef : null}
            >
              {/* AVATAR */}
              <img
                src={
                  isOwn
                    ? authUser?.profilePic || "/avatar.png"
                    : selectedUser?.profilePic || "/avatar.png"
                }
                alt="profile"
                className="hidden size-8 shrink-0 rounded-xl object-cover sm:block"
              />

              {/* BUBBLE COLUMN */}
              <div
                className={`flex max-w-[78%] flex-col gap-1 sm:max-w-[65%] ${
                  isOwn ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`relative px-3.5 py-2.5 text-sm shadow-sm transition-shadow ${
                    isOwn
                      ? "rounded-3xl rounded-br-md bg-primary text-primary-content"
                      : "rounded-3xl rounded-bl-md bg-base-100 text-base-content ring-1 ring-base-content/5"
                  }`}
                >
                  {/* IMAGE */}
                  {message.image && (
                    <img
                      src={message.image}
                      alt="attachment"
                      className="mb-2 max-w-[220px] rounded-2xl"
                    />
                  )}

                  {/* TEXT */}
                  {message.text && (
                    <p className="whitespace-pre-wrap break-words leading-relaxed">
                      {message.text}
                    </p>
                  )}

                  {/* VOICE NOTE */}
                  {message.audio && (
                    <div
                      className={`flex w-full max-w-[300px] items-center gap-2 rounded-2xl ${
                        message.text || message.image ? "mt-2" : ""
                      } ${
                        isOwn
                          ? "bg-primary-content/15"
                          : "bg-base-200"
                      } px-2 py-1`}
                    >
                      <audio
                        controls
                        preload="metadata"
                        src={message.audio}
                        className="min-w-0 flex-1"
                      />
                    </div>
                  )}
                </div>

                {/* TIME */}
                <time className="px-1 text-[11px] text-base-content/40">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
            </div>
          );
        })}

        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center text-base-content/40">
            <p className="text-sm">No messages yet</p>
            <p className="text-xs">Say hello and start the conversation</p>
          </div>
        )}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
