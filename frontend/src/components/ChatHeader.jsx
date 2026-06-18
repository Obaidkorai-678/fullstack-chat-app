import { ChevronLeft } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="glass border-b border-base-content/5 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Back button (mobile) */}
          <button
            onClick={() => setSelectedUser(null)}
            className="grid size-9 place-items-center rounded-xl text-base-content/70 transition-colors hover:bg-base-content/10 md:hidden"
            aria-label="Back to contacts"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Avatar */}
          <div className="relative">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName}
              className="size-11 rounded-2xl object-cover"
            />
            {isOnline && (
              <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-green-500 ring-2 ring-base-100" />
            )}
          </div>

          {/* User info */}
          <div className="leading-tight">
            <h3 className="font-display font-bold">{selectedUser.fullName}</h3>
            <p className="flex items-center gap-1.5 text-xs text-base-content/60">
              <span
                className={`size-1.5 rounded-full ${
                  isOnline ? "bg-green-500" : "bg-base-content/30"
                }`}
              />
              {isOnline ? "Active now" : "Offline"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
