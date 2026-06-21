import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Check, Camera, Users, Loader as Loader2, ArrowLeft } from "lucide-react";
import { useGroupStore } from "../store/useGroupStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const CreateGroupModal = ({ isOpen, onClose }) => {
  const { allUsers, fetchAllUsers, createGroup, isCreatingGroup } = useGroupStore();
  const { authUser } = useAuthStore();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [query, setQuery] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchAllUsers();
      setStep(1);
      setName("");
      setDescription("");
      setAvatar(null);
      setSelectedIds([]);
      setQuery("");
    }
  }, [isOpen, fetchAllUsers]);

  const toggleUser = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Group name is required");
    if (selectedIds.length === 0) return toast.error("Select at least one member");
    const group = await createGroup({
      name,
      description,
      memberIds: selectedIds,
      avatar,
    });
    if (group) onClose();
  };

  const filtered = allUsers.filter((u) => {
    const q = query.toLowerCase();
    return !q || u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="panel w-full max-w-md overflow-hidden rounded-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-base-content/8 p-5">
              <div className="flex items-center gap-3">
                {step === 2 && (
                  <button
                    onClick={() => setStep(1)}
                    className="grid size-8 place-items-center rounded-xl hover:bg-base-content/10"
                  >
                    <ArrowLeft className="size-4" />
                  </button>
                )}
                <div className="grid size-9 place-items-center rounded-xl bg-primary/15">
                  <Users className="size-5 text-primary" />
                </div>
                <h2 className="font-display text-lg font-bold">
                  {step === 1 ? "New Group" : `Add Members (${selectedIds.length})`}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="grid size-8 place-items-center rounded-xl hover:bg-base-content/10"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* STEP 1: GROUP INFO */}
            {step === 1 && (
              <div className="p-5 space-y-5">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <img
                      src={avatar || "/avatar.png"}
                      alt="group"
                      className="size-24 rounded-4xl border-2 border-base-content/10 object-cover"
                    />
                    <label
                      htmlFor="group-avatar"
                      className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-2xl bg-primary text-primary-content shadow-lg cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Camera className="size-4" />
                    </label>
                    <input
                      id="group-avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleAvatar}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Group Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Design Team"
                    className="w-full rounded-2xl border border-base-content/10 bg-base-200/60 py-3 px-4 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    maxLength={80}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Description (optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this group about?"
                    rows={2}
                    className="w-full rounded-2xl border border-base-content/10 bg-base-200/60 py-3 px-4 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 resize-none"
                    maxLength={200}
                  />
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!name.trim()}
                  className="w-full rounded-2xl bg-primary py-3 font-semibold text-primary-content shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                >
                  Next: Add Members
                </button>
              </div>
            )}

            {/* STEP 2: MEMBER SELECTION */}
            {step === 2 && (
              <div className="flex flex-col max-h-[70vh]">
                <div className="relative p-4">
                  <Search className="pointer-events-none absolute left-7 top-1/2 size-4 -translate-y-1/2 text-base-content/40" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search people…"
                    className="w-full rounded-2xl border border-base-content/10 bg-base-200/60 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex-1 overflow-y-auto px-3 pb-3">
                  {filtered.map((u) => {
                    const selected = selectedIds.includes(u._id);
                    return (
                      <button
                        key={u._id}
                        onClick={() => toggleUser(u._id)}
                        className={`flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-all ${
                          selected ? "bg-primary/10" : "hover:bg-base-content/5"
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={u.profilePic || "/avatar.png"}
                            className="size-11 rounded-2xl object-cover"
                            alt={u.fullName}
                          />
                          <div
                            className={`absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full border-2 border-base-100 transition-all ${
                              selected ? "bg-primary text-primary-content" : "bg-base-300"
                            }`}
                          >
                            {selected && <Check className="size-3" />}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-sm">{u.fullName}</p>
                          <p className="truncate text-xs text-base-content/50">{u.email}</p>
                        </div>
                      </button>
                    );
                  })}
                  {filtered.length === 0 && (
                    <p className="py-8 text-center text-sm text-base-content/40">No people found</p>
                  )}
                </div>

                <div className="border-t border-base-content/8 p-4">
                  <button
                    onClick={handleCreate}
                    disabled={isCreatingGroup || selectedIds.length === 0}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 font-semibold text-primary-content shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {isCreatingGroup ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Creating…
                      </>
                    ) : (
                      `Create Group (${selectedIds.length})`
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateGroupModal;