


import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useGroupStore } from "../store/useGroupStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import GroupChatContainer from "../components/GroupChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const { selectedGroup } = useGroupStore();

  const [activeTab, setActiveTab] = useState("chats");
  const [chatMode, setChatMode] = useState("dm");

  const hasActiveChat = !!selectedUser || !!selectedGroup;

  return (
    <div className="h-screen overflow-hidden pt-16">
      <div className="h-[calc(100vh-4rem)] p-0 sm:p-3 lg:p-5 xl:p-6">
        <div
          className="
            glass-strong
            relative
            h-full
            w-full
            overflow-hidden
            rounded-none
            sm:rounded-3xl
            shadow-2xl
            shadow-base-content/10
          "
        >
          <div className="flex h-full w-full overflow-hidden">
            {/* MOBILE SIDEBAR */}
            <div
              className={`
                ${
                  hasActiveChat
                    ? "hidden md:flex"
                    : "flex"
                }
                h-full
                w-full
                flex-col

                md:w-[340px]
                lg:w-[380px]
                xl:w-[420px]
                2xl:w-[460px]
              `}
            >
              <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onSelectChat={setChatMode}
              />
            </div>

            {/* CHAT AREA */}
            <div
              className={`
                ${
                  hasActiveChat
                    ? "flex"
                    : "hidden md:flex"
                }
                min-w-0
                flex-1
                h-full
                overflow-hidden
              `}
            >
              {selectedUser ? (
                <ChatContainer />
              ) : selectedGroup ? (
                <GroupChatContainer />
              ) : (
                <NoChatSelected />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;