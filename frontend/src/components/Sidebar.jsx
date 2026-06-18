import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search } from "lucide-react";
import { motion } from "framer-motion";

const Sidebar = () => {
  const {
    users = [],
    getUsers,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    searchQuery,
    setSearchQuery,
  } = useChatStore();

  const { onlineUsers = [] } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users
    .filter((user) =>
      showOnlineOnly ? onlineUsers.includes(user?._id) : true
    )
    .filter((user) =>
      (user?.fullName || "")
        .toLowerCase()
        .includes((searchQuery || "").toLowerCase())
    );

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="flex h-full w-full shrink-0 flex-col border-r border-base-content/5 bg-base-100/40 md:w-[300px] lg:w-[340px]">
      {/* HEADER */}
      <div className="border-b border-base-content/5 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <Users className="size-5 text-primary" />
            </div>
            <div className="leading-tight">
              <h2 className="font-display font-bold">Messages</h2>
              <p className="text-xs text-base-content/50">
                {onlineUsers.length} online now
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            placeholder="Search people…"
            className="w-full rounded-2xl border border-base-content/10 bg-base-200/60 py-2.5 pl-10 pr-3 text-sm outline-none transition-all focus:border-primary/50 focus:bg-base-100 focus:ring-2 focus:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* ONLINE FILTER */}
        <label className="mt-4 flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="checkbox checkbox-primary checkbox-sm rounded-md"
          />
          <span className="text-sm text-base-content/70">Show online only</span>
        </label>
      </div>

      {/* USERS LIST */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {filteredUsers.length === 0 && (
          <div className="px-3 py-10 text-center text-sm text-base-content/40">
            No people found
          </div>
        )}

        <div className="space-y-1">
          {filteredUsers.map((user, i) => {
            const isOnline = onlineUsers.includes(user?._id);
            const isActive = selectedUser?._id === user?._id;

            return (
              <motion.button
                key={user?._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.25 }}
                onClick={() => setSelectedUser(user)}
                className={`group flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 ring-1 ring-primary/30"
                    : "hover:bg-base-content/5"
                }`}
              >
                {/* AVATAR */}
                <div className="relative shrink-0">
                  <img
                    src={user?.profilePic || "/avatar.png"}
                    className="size-12 rounded-2xl object-cover"
                    alt={user?.fullName || "User"}
                  />
                  {isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-green-500 ring-2 ring-base-100" />
                  )}
                </div>

                {/* NAME */}
                <div className="min-w-0 flex-1">
                  <div
                    className={`truncate font-semibold ${
                      isActive ? "text-primary" : "text-base-content"
                    }`}
                  >
                    {user?.fullName || "Unknown User"}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span
                      className={`size-1.5 rounded-full ${
                        isOnline ? "bg-green-500" : "bg-base-content/30"
                      }`}
                    />
                    <span className="text-base-content/50">
                      {isOnline ? "Active now" : "Offline"}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
