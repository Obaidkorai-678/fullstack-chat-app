import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen pt-16">
      <div className="h-[calc(100vh-4rem)] px-0 py-0 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
        <div className="glass-strong h-full w-full overflow-hidden rounded-none sm:rounded-3xl shadow-2xl shadow-base-content/10">
          <div className="flex h-full w-full">
            {/* Sidebar */}
            <div
              className={`${
                selectedUser ? "hidden md:flex" : "flex"
              } h-full w-full flex-col md:w-auto`}
            >
              <Sidebar />
            </div>

            {/* Chat area */}
            <div
              className={`${
                selectedUser ? "flex" : "hidden md:flex"
              } h-full flex-1`}
            >
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
