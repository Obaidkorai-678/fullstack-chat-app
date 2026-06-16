import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
    
        <div className="pt-16 h-[calc(100vh-4rem)]">

  <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-none h-[calc(100vh-6rem)]">
          <div className="flex h-full w-full rounded-lg overflow-hidden">
            <div className="flex h-full">

  <div
    className={`
      ${selectedUser ? "hidden md:flex" : "flex"}
      flex-col
      h-full
      w-full
      md:w-auto
    `}
  >
    <Sidebar />
  </div>

  <div
    className={`
      ${selectedUser ? "flex" : "hidden md:flex"}
      flex-1
      h-full
    `}
  >
    {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
  </div>

</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;