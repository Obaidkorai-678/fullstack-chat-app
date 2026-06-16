
import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search } from "lucide-react";

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

  // load users once
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // ✅ SAFE FILTERING (no crashes even if data is missing)
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


<aside
  className="
    h-full
    w-[280px]
    lg:w-[320px]
    xl:w-[350px]
    border-r
    border-base-300
    flex
    flex-col
    shrink-0
  "
>
      {/* HEADER */}
      <div className="border-b border-base-300 w-full p-5">

        <div className="flex items-center gap-2">
          <Users className="size-6" />
        
          <span className="font-medium block">Contacts</span>
        </div>

        {/* SEARCH */}
     
        <div className="mt-3 relative">
            <Search className="absolute left-2 top-2.5 size-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="input input-bordered w-full pl-8 input-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* ONLINE FILTER */}
    
              <div className="mt-3 flex items-center gap-2">
           <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm checkbox-primary"
            />

            <span className="text-sm">Online users only</span>
          </label>

          <span className="text-xs text-zinc-500">
            ({onlineUsers.length} online)
          </span>
        </div>
      </div>

      {/* USERS LIST */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user?._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 ${
              selectedUser?._id === user?._id ? "bg-base-300" : ""
            }`}
          >

            {/* AVATAR */}
            <div className="relative">
              <img
                src={user?.profilePic || "/avatar.png"}
                className="size-12 rounded-full"
                alt={user?.fullName || "User"}
              />

              {onlineUsers.includes(user?._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full" />
              )}
            </div>

            {/* NAME */}
              <div className="flex-1 text-left min-w-0">
                {/* <div className="font-medium"> */}
              <div className="font-medium truncate">
                {user?.fullName || "Unknown User"}
              </div>

              <div className="text-xs text-zinc-400 truncate">
                {onlineUsers.includes(user?._id) ? "Online" : "Offline"}
              </div>
            </div>

          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;

