



import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import { Check, CheckCheck } from "lucide-react";

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
    markMessagesSeen,
    clearTyping,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessages(selectedUser._id);
    markMessagesSeen(selectedUser._id);

    if (typeof subscribeToMessages === "function") {
      subscribeToMessages();
    }

    return () => {
      if (typeof unsubscribeFromMessages === "function") {
        unsubscribeFromMessages();
      }

      if (typeof clearTyping === "function") {
        clearTyping(selectedUser._id);
      }
    };
  }, [selectedUser?._id]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-base-200/20">
      <ChatHeader />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3">
          {messages.map((message, index) => {
            const isOwn = message.senderId === authUser?._id;

            return (
              <div
                key={message._id || index}
                ref={index === messages.length - 1 ? messageEndRef : null}
                className={`flex items-end gap-2 ${
                  isOwn ? "justify-end" : "justify-start"
                }`}
              >
                {!isOwn && (
                  <img
                    src={
                      selectedUser?.profilePic || "/avatar.png"
                    }
                    alt={selectedUser?.fullName}
                    className="hidden h-9 w-9 shrink-0 rounded-xl object-cover md:block"
                  />
                )}

                <div
                  className={`flex flex-col ${
                    isOwn ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`
                      relative
                      break-words
                      px-4
                      py-3
                      shadow-sm
                      transition-all

                      max-w-[90vw]
                      sm:max-w-[80vw]
                      md:max-w-[70vw]
                      lg:max-w-[60vw]
                      xl:max-w-[700px]

                      ${
                        isOwn
                          ? "rounded-3xl rounded-br-md bg-primary text-primary-content"
                          : "rounded-3xl rounded-bl-md bg-base-100 text-base-content border border-base-content/5"
                      }
                    `}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="attachment"
                        className="mb-2 max-h-[400px] w-auto rounded-2xl object-cover"
                      />
                    )}

                    {message.text && (
                      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed md:text-[15px]">
                        {message.text}
                      </p>
                    )}

                    {message.audio && (
                      <div
                        className={`
                          mt-2 rounded-2xl px-2 py-2
                          ${
                            isOwn
                              ? "bg-primary-content/15"
                              : "bg-base-200"
                          }
                        `}
                      >
                        <audio
                          controls
                          preload="metadata"
                          src={message.audio}
                          className="w-full min-w-[220px] max-w-[350px]"
                        />
                      </div>
                    )}

                    <div
                      className={`
                        mt-1 flex items-center justify-end gap-1
                        text-[10px]
                        ${
                          isOwn
                            ? "text-primary-content/70"
                            : "text-base-content/50"
                        }
                      `}
                    >
                      <time>
                        {formatMessageTime(message.createdAt)}
                      </time>

                      {isOwn &&
                        (message.seen ? (
                          <CheckCheck className="size-3.5 text-sky-300" />
                        ) : message.delivered ? (
                          <CheckCheck className="size-3.5" />
                        ) : (
                          <Check className="size-3.5" />
                        ))}
                    </div>
                  </div>
                </div>

                {isOwn && (
                  <img
                    src={
                      authUser?.profilePic || "/avatar.png"
                    }
                    alt={authUser?.fullName}
                    className="hidden h-9 w-9 shrink-0 rounded-xl object-cover md:block"
                  />
                )}
              </div>
            );
          })}

          {messages.length === 0 && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
              <p className="text-base font-medium text-base-content/60">
                No messages yet
              </p>
              <p className="mt-1 text-sm text-base-content/40">
                Say hello and start the conversation
              </p>
            </div>
          )}
        </div>
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;