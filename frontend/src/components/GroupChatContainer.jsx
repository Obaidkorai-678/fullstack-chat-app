import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, Users, Info, LogOut, Plus, X, Shield,
} from "lucide-react";
import { useGroupStore } from "../store/useGroupStore";
import { useAuthStore } from "../store/useAuthStore";
import MessageInput from "./MessageInput";
import { formatMessageTime } from "../lib/utils";

const GroupChatContainer = () => {
  const {
    selectedGroup, groupMessages, fetchGroupMessages, isSendingGroupMessage,
    fetchGroup, leaveGroup, addMember, removeMember, typingUsers, clearTyping,
  } = useGroupStore();
  const { authUser, isUserOnline } = useAuthStore();

  const [showDetails, setShowDetails] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedGroup?._id) return;
    fetchGroupMessages(selectedGroup._id);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup?._id]);

  // auto-clear typing
  useEffect(() => {
    if (!selectedGroup?._id) return;
    const t = setInterval(() => clearTyping(selectedGroup._id), 4000);
    return () => clearInterval(t);
  }, [selectedGroup?._id, clearTyping]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [groupMessages]);

  if (!selectedGroup) return null;

  const isAdmin = selectedGroup.members?.some(
    (m) => m.userId?._id === authUser?._id && m.role === "admin"
  );
  const typingSet = typingUsers[selectedGroup._id] || new Set();
  const typingNames = Array.from(typingSet)
    .filter((id) => id !== authUser?._id)
    .slice(0, 2)
    .map((id) => selectedGroup.members.find((m) => m.userId?._id === id)?.userId?.fullName || "Someone");
  const typingText =
    typingNames.length === 0
      ? ""
      : typingNames.length === 1
      ? `${typingNames[0]} is typing…`
      : `${typingNames.join(", ")} are typing…`;

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-base-200/30">
      {/* HEADER */}
      <div className="glass border-b border-base-content/5 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => useGroupStore.getState().setSelectedGroup(null)}
              className="grid size-9 place-items-center rounded-xl text-base-content/70 hover:bg-base-content/10 md:hidden"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="relative">
              <img
                src={selectedGroup.avatar || "/avatar.png"}
                className="size-11 rounded-2xl object-cover"
                alt={selectedGroup.name}
              />
            </div>
            <div className="leading-tight">
              <h3 className="font-display font-bold">{selectedGroup.name}</h3>
              <p className="text-xs text-base-content/60">
                {selectedGroup.members?.length || 0} members
                {typingText && <span className="text-primary"> · {typingText}</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowDetails(true)}
              className="grid size-9 place-items-center rounded-xl text-base-content/70 hover:bg-base-content/10"
              aria-label="Group info"
            >
              <Info className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <GroupMessages
        messages={groupMessages}
        authUser={authUser}
        selectedGroup={selectedGroup}
        messageEndRef={messageEndRef}
      />

      <MessageInput isGroup />

      {/* DETAILS DRAWER */}
      <AnimatePresence>
        {showDetails && (
          <GroupDetails
            group={selectedGroup}
            isAdmin={isAdmin}
            authUser={authUser}
            onClose={() => setShowDetails(false)}
            onLeave={() => {
              leaveGroup(selectedGroup._id);
              setShowDetails(false);
            }}
            onAddMember={() => {
              setShowAddMember(true);
            }}
            onRemoveMember={(uid) => removeMember(selectedGroup._id, uid)}
            fetchGroup={() => fetchGroup(selectedGroup._id)}
            allUsersHook
          />
        )}
      </AnimatePresence>

      {/* ADD MEMBER MODAL */}
      <AnimatePresence>
        {showAddMember && (
          <AddMemberModal
            group={selectedGroup}
            onClose={() => setShowAddMember(false)}
            onAdd={(uid) => addMember(selectedGroup._id, uid)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ================= GROUP MESSAGES =================
const GroupMessages = ({ messages, authUser, selectedGroup, messageEndRef }) => {
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center text-base-content/40">
        <Users className="mb-2 size-8 text-base-content/20" />
        <p className="text-sm">No messages yet</p>
        <p className="text-xs">Start the group conversation</p>
      </div>
    );
  }
  return (
    <div className="flex-1 space-y-2 overflow-y-auto px-3 py-4 sm:px-6">
      {messages.map((message, index) => {
        const isOwn = message.senderId?._id === authUser?._id || message.senderId === authUser?._id;
        const sender = message.senderId?._id ? message.senderId : { _id: message.senderId, fullName: "Member" };
        const seenCount = message.seenBy?.filter((s) => s.userId !== sender._id).length || 0;
        const totalOthers = selectedGroup.members.length - 1;

        return (
          <div
            key={message._id || index}
            className={`flex animate-bubble-in items-end gap-2.5 ${
              isOwn ? "flex-row-reverse" : "flex-row"
            }`}
            ref={index === messages.length - 1 ? messageEndRef : null}
          >
            {!isOwn && (
              <img
                src={sender.profilePic || "/avatar.png"}
                alt={sender.fullName}
                className="hidden size-8 shrink-0 rounded-xl object-cover sm:block"
              />
            )}
            <div className={`flex max-w-[78%] flex-col gap-1 sm:max-w-[65%] ${isOwn ? "items-end" : "items-start"}`}>
              {!isOwn && (
                <span className="px-1 text-[11px] font-semibold text-primary">
                  {sender.fullName}
                </span>
              )}
              <div
                className={`relative px-3.5 py-2.5 text-sm shadow-sm ${
                  isOwn
                    ? "rounded-3xl rounded-br-md bg-primary text-primary-content"
                    : "rounded-3xl rounded-bl-md bg-base-100 text-base-content ring-1 ring-base-content/5"
                }`}
              >
                {message.image && (
                  <img src={message.image} alt="attachment" className="mb-2 max-w-[220px] rounded-2xl" />
                )}
                {message.text && (
                  <p className="whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
                )}
                {message.audio && (
                  <div className={`flex w-full max-w-[300px] items-center gap-2 rounded-2xl ${isOwn ? "bg-primary-content/15" : "bg-base-200"} px-2 py-1`}>
                    <audio controls preload="metadata" src={message.audio} className="min-w-0 flex-1" />
                  </div>
                )}
                {isOwn && (
                  <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-primary-content/70">
                    {seenCount > 0 ? `${seenCount}/${totalOthers}` : "Sent"}
                  </span>
                )}
              </div>
              <time className="px-1 text-[11px] text-base-content/40">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ================= GROUP DETAILS DRAWER =================
const GroupDetails = ({ group, isAdmin, authUser, onClose, onLeave, onAddMember, onRemoveMember }) => {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 280 }}
      className="absolute inset-y-0 right-0 z-30 w-full max-w-sm border-l border-base-content/8 bg-base-100 shadow-2xl"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-base-content/8 p-4">
          <h3 className="font-display font-bold">Group Info</h3>
          <button onClick={onClose} className="grid size-8 place-items-center rounded-xl hover:bg-base-content/10">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex flex-col items-center text-center">
            <img src={group.avatar || "/avatar.png"} className="size-24 rounded-4xl object-cover shadow-lg" alt={group.name} />
            <h2 className="mt-4 font-display text-xl font-bold">{group.name}</h2>
            <p className="text-sm text-base-content/50">{group.members?.length || 0} members</p>
            {group.description && <p className="mt-2 text-sm text-base-content/70">{group.description}</p>}
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Members</p>
              {isAdmin && (
                <button onClick={onAddMember} className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                  <Plus className="size-3.5" /> Add
                </button>
              )}
            </div>
            <div className="space-y-1">
              {group.members?.map((m) => {
                const isSelf = m.userId?._id === authUser?._id;
                const canRemove = isAdmin && !isSelf;
                return (
                  <div key={m.userId?._id} className="flex items-center gap-3 rounded-2xl p-2.5 hover:bg-base-content/5">
                    <div className="relative">
                      <img src={m.userId?.profilePic || "/avatar.png"} className="size-10 rounded-2xl object-cover" alt="" />
                      <span className="absolute -bottom-1 -right-1 grid size-4 place-items-center rounded-full bg-base-100">
                        {m.role === "admin" ? <Shield className="size-3 text-primary" /> : <Users className="size-3 text-base-content/40" />}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {isSelf ? "You" : m.userId?.fullName}{" "}
                        {m.role === "admin" && <span className="text-[10px] font-medium text-primary">admin</span>}
                      </p>
                      <p className="truncate text-xs text-base-content/50">{m.userId?.email}</p>
                    </div>
                    {canRemove && (
                      <button
                        onClick={() => onRemoveMember(m.userId?._id)}
                        className="grid size-8 place-items-center rounded-xl text-error/70 hover:bg-error/10"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-base-content/8 p-4">
          <button
            onClick={onLeave}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-error/10 py-3 font-medium text-error transition-all hover:bg-error/20"
          >
            <LogOut className="size-4" />
            {isAdmin ? "Leave Group" : "Leave Group"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ================= ADD MEMBER MODAL =================
const AddMemberModal = ({ group, onClose, onAdd }) => {
  const { allUsers, fetchAllUsers } = useGroupStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const memberIds = group.members?.map((m) => m.userId?._id) || [];
  const filtered = (allUsers || [])
    .filter((u) => !memberIds.includes(u._id))
    .filter((u) => {
      const q = query.toLowerCase();
      return !q || u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="panel w-full max-w-md overflow-hidden rounded-4xl"
      >
        <div className="flex items-center justify-between border-b border-base-content/8 p-5">
          <h3 className="font-display font-bold">Add Member</h3>
          <button onClick={onClose} className="grid size-8 place-items-center rounded-xl hover:bg-base-content/10">
            <X className="size-4" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-base-content/40">No users to add</p>
          )}
          {filtered.map((u) => (
            <button
              key={u._id}
              onClick={() => {
                onAdd(u._id);
                onClose();
              }}
              className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left hover:bg-base-content/5"
            >
              <img src={u.profilePic || "/avatar.png"} className="size-10 rounded-2xl object-cover" alt="" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{u.fullName}</p>
                <p className="truncate text-xs text-base-content/50">{u.email}</p>
              </div>
              <Plus className="size-4 text-primary" />
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GroupChatContainer;