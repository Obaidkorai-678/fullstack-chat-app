import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Search, Plus, CircleDot, MessageCircle,
  Camera,
} from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useGroupStore } from "../store/useGroupStore";
import { useStatusStore } from "../store/useStatusStore";
import { useAuthStore } from "../store/useAuthStore";
import { previewMessage } from "../lib/utils";
import { useLastSeen } from "../hooks/useLastSeen";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import CreateGroupModal from "./CreateGroupModal";
import CreateStatusModal from "./CreateStatusModal";

const TABS = [
  { id: "chats", label: "Chats", icon: MessageCircle },
  { id: "groups", label: "Groups", icon: Users },
  { id: "status", label: "Status", icon: CircleDot },
];

const Sidebar = ({ activeTab, onTabChange, onSelectChat }) => {
  const {
    users, getUsers, selectedUser, setSelectedUser, isUsersLoading,
    searchQuery, setSearchQuery, showOnlineOnly, toggleOnlineOnly,
  } = useChatStore();
  const {
    groups, fetchGroups, selectedGroup, joinGroupRoom, leaveGroupRoom,
    subscribeToGroupMessages, isLoadingGroups,
  } = useGroupStore();
  const {
    ownStatuses, othersStatuses, fetchStatuses, openViewer,
    subscribeToStatusUpdates,
  } = useStatusStore();
  const { authUser, onlineUsers, isUserOnline } = useAuthStore();

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    getUsers();
    fetchGroups();
    fetchStatuses();
    subscribeToGroupMessages();
    subscribeToStatusUpdates();
    return () => {
      leaveGroupRoom(selectedGroup?._id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = users
    .filter((u) => (showOnlineOnly ? onlineUsers.includes(u._id) : true))
    .filter((u) => {
      const q = (searchQuery || "").toLowerCase();
      return !q || u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    });

  const filteredGroups = (groups || [])
    .filter((g) => {
      const q = (searchQuery || "").toLowerCase();
      return !q || g.name?.toLowerCase().includes(q);
    })
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    if (selectedGroup) {
      leaveGroupRoom(selectedGroup._id);
      useGroupStore.getState().setSelectedGroup(null);
    }
    onSelectChat?.("dm");
  };

  const handleSelectGroup = (group) => {
    if (selectedGroup?._id && selectedGroup._id !== group._id) {
      leaveGroupRoom(selectedGroup._id);
    }
    useGroupStore.getState().setSelectedGroup(group);
    joinGroupRoom(group._id);
    if (selectedUser) setSelectedUser(null);
    onSelectChat?.("group");
  };

  const hasOwnStatus = ownStatuses.length > 0;

  if (isUsersLoading && activeTab === "chats") return <SidebarSkeleton />;

  return (
<aside className="
flex
h-full
w-full
shrink-0
flex-col
border-r
border-base-content/5
bg-base-100/40

md:w-[340px]
lg:w-[380px]
xl:w-[420px]
2xl:w-[460px]
">
        {/* HEADER */}
      <div className="border-b border-base-content/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <Users className="size-5 text-primary" />
            </div>
            <div className="leading-tight">
              <h2 className="font-display text-lg lg:text-xl font-bold">Messages</h2>
              <p className="text-xs text-base-content/50">
                {onlineUsers.length} online now
              </p>
            </div>
          </div>
          {activeTab === "groups" && (
            <button
              onClick={() => setShowGroupModal(true)}
              className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary transition-all hover:bg-primary hover:text-primary-content"
              aria-label="Create group"
            >
              <Plus className="size-5" />
            </button>
          )}
          {activeTab === "status" && (
            <button
              onClick={() => setShowStatusModal(true)}
              className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary transition-all hover:bg-primary hover:text-primary-content"
              aria-label="Add status"
            >
              <Camera className="size-5" />
            </button>
          )}
        </div>

        {/* TABS */}
<div className="mt-4 grid grid-cols-3 gap-1 rounded-2xl bg-base-200/60 p-1 lg:p-1.5">          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-medium transition-all ${
                activeTab === t.id
                  ? "bg-primary text-primary-content shadow"
                  : "text-base-content/60 hover:text-base-content"
              }`}
            >
              <t.icon className="size-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {activeTab !== "status" && (
          <>
            {/* SEARCH */}
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                placeholder="Search…"
                className="w-full rounded-2xl border border-base-content/10 bg-base-200/60 py-2.5 pl-10 pr-3 text-sm outline-none transition-all focus:border-primary/50 focus:bg-base-100 focus:ring-2 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {activeTab === "chats" && (
              <label className="mt-3 flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={showOnlineOnly}
                  onChange={toggleOnlineOnly}
                  className="checkbox checkbox-primary checkbox-sm rounded-md"
                />
                <span className="text-sm text-base-content/70">Show online only</span>
              </label>
            )}
          </>
        )}
      </div>

      {/* CONTENT */}
<div className="flex-1 overflow-y-auto px-3 lg:px-4 xl:px-5 py-3">
          {activeTab === "chats" && (
          <UserList
            users={filteredUsers}
            onlineUsers={onlineUsers}
            selectedId={selectedUser?._id}
            onSelect={handleSelectUser}
            isUserOnline={isUserOnline}
          />
        )}

        {activeTab === "groups" && (
          <GroupList
            groups={filteredGroups}
            selectedId={selectedGroup?._id}
            onSelect={handleSelectGroup}
            isLoading={isLoadingGroups}
          />
        )}

        {activeTab === "status" && (
          <StatusList
            authUser={authUser}
            ownStatuses={ownStatuses}
            othersStatuses={othersStatuses}
            hasOwnStatus={hasOwnStatus}
            onCreate={() => setShowStatusModal(true)}
            onView={(userId) => openViewer(userId)}
          />
        )}
      </div>

      <CreateGroupModal isOpen={showGroupModal} onClose={() => setShowGroupModal(false)} />
      <CreateStatusModal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} />
    </aside>
  );
};

// ================= USER LIST =================
const UserList = ({ users, onlineUsers, selectedId, onSelect, isUserOnline }) => {
  if (users.length === 0) {
    return (
      <div className="px-3 py-10 text-center text-sm text-base-content/40">
        No conversations yet
      </div>
    );
  }
  return (
    <div className="space-y-1">
      {users.map((user, i) => {
        const isOnline = onlineUsers.includes(user._id);
        const isActive = selectedId === user._id;
        const unread = user.unreadCount || 0;
        return (
          <motion.button
            key={user._id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.25 }}
            onClick={() => onSelect(user)}
            className={`group flex w-full items-center gap-3 lg:gap-4 rounded-2xl p-2.5 lg:p-3.5 text-left transition-all duration-200 ${
              isActive ? "bg-primary/10 ring-1 ring-primary/30" : "hover:bg-base-content/5"
            }`}
          >
            <div className="relative shrink-0">
              <img
  src={user.profilePic || "/avatar.png"}
  className="size-12 lg:size-14 xl:size-16 rounded-2xl object-cover"
  alt={user.fullName}
/>
              {isOnline && (
                <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-green-500 ring-2 ring-base-100" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className={`truncate font-semibold ${isActive ? "text-primary" : ""}`}>
                  {user.fullName}
                </span>
                {user.lastMessage?.createdAt && (
                  <span className="shrink-0 text-[10px] text-base-content/40">
                    {new Date(user.lastMessage.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs text-base-content/50">
                  {user.lastMessage
                    ? previewMessage(user.lastMessage)
                    : <LivePresenceText userId={user._id} isOnline={isOnline} />}
                </span>
                {unread > 0 && (
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-content">
                    {unread > 99 ? "99+" : unread}
                  </span>
                )}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

// ================= GROUP LIST =================
const GroupList = ({ groups, selectedId, onSelect, isLoading }) => {
  if (isLoading && groups.length === 0) {
    return <div className="px-3 py-10 text-center text-sm text-base-content/40">Loading groups…</div>;
  }
  if (groups.length === 0) {
    return (
      <div className="px-3 py-10 text-center text-sm text-base-content/40">
        No groups yet. Tap + to create one.
      </div>
    );
  }
  return (
    <div className="space-y-1">
      {groups.map((group, i) => {
        const isActive = selectedId === group._id;
        const memberCount = group.members?.length || 0;
        return (
          <motion.button
            key={group._id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.25 }}
            onClick={() => onSelect(group)}
            className={`group flex w-full items-center gap-3 lg:gap-4 rounded-2xl p-2.5 lg:p-3.5 text-left transition-all duration-200 ${
              isActive ? "bg-primary/10 ring-1 ring-primary/30" : "hover:bg-base-content/5"
            }`}
          >
            <div className="relative shrink-0">
              <img
                src={group.avatar || "/avatar.png"}
                   className="size-12 lg:size-14 xl:size-16 rounded-2xl object-cover"
                alt={group.name}
              />
              <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full bg-secondary text-[10px] font-bold text-secondary-content ring-2 ring-base-100">
                <Users className="size-3" />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className={`truncate font-semibold ${isActive ? "text-primary" : ""}`}>
                {group.name}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-base-content/50">
                <span>{memberCount} members</span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

// ================= STATUS LIST =================
const StatusList = ({ authUser, ownStatuses, othersStatuses, hasOwnStatus, onCreate, onView }) => {
  return (
    <div className="space-y-3">
      {/* MY STATUS */}
      <button
        onClick={() => (hasOwnStatus ? onView("own") : onCreate())}
        className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-all hover:bg-base-content/5"
      >
        <div className="relative shrink-0">
          <img
            src={authUser?.profilePic || "/avatar.png"}
            className={`size-12 lg:size-14 xl:size-16 rounded-2xl object-cover ${hasOwnStatus ? "ring-2 ring-primary ring-offset-2 ring-offset-base-100" : ""}`}
            alt="My status"
          />
          {!hasOwnStatus && (
            <span className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full bg-primary text-primary-content ring-2 ring-base-100">
              <Plus className="size-3.5" />
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">My Status</p>
          <p className="text-xs text-base-content/50">
            {hasOwnStatus ? "Tap to view" : "Tap to add status"}
          </p>
        </div>
      </button>

      {othersStatuses.length > 0 && (
        <div className="pt-2">
          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-base-content/40">
            Recent Updates
          </p>
          {othersStatuses.map((entry) => (
            <button
              key={entry.userId}
              onClick={() => onView(entry.userId)}
              className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-all hover:bg-base-content/5"
            >
              <div className="relative shrink-0">
                <img
                  src={entry.statuses?.[0]?.userId?.profilePic || "/avatar.png"}
                  className="size-12 lg:size-14 xl:size-16 rounded-2xl object-cover ring-2 ring-primary ring-offset-2 ring-offset-base-100"
                  alt=""
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{entry.statuses?.[0]?.userId?.fullName || "Contact"}</p>
                <p className="text-xs text-base-content/50">
                  {new Date(entry.statuses?.[0]?.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {othersStatuses.length === 0 && !hasOwnStatus && (
        <div className="px-3 py-8 text-center text-sm text-base-content/40">
          No recent status updates
        </div>
      )}
    </div>
  );
};

// ── Live presence text — ticks every 30 s, reads from userPresence map ──
const LivePresenceText = ({ userId, isOnline }) => {
  const { text } = useLastSeen(userId);
  return <>{text}</>;
};

export default Sidebar;