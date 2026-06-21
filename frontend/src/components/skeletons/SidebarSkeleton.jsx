import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="flex h-full w-full shrink-0 flex-col border-r border-base-content/5 bg-base-100/40 md:w-[300px] lg:w-[340px]">
      {/* Header */}
      <div className="border-b border-base-content/5 p-5">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-primary/15 flex items-center justify-center">
            <Users className="size-5 text-primary" />
          </div>
          <span className="font-display font-bold">Messages</span>
        </div>
        <div className="skeleton mt-4 h-11 w-full rounded-2xl" />
      </div>

      {/* Skeleton Contacts */}
      <div className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="flex items-center gap-3 rounded-2xl p-2.5">
            <div className="skeleton size-12 shrink-0 rounded-2xl" />
            <div className="min-w-0 flex-1">
              <div className="skeleton mb-2 h-4 w-32" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
