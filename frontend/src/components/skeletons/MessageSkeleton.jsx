const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 space-y-3 overflow-y-auto bg-base-200/30 px-3 py-5 sm:px-6">
      {skeletonMessages.map((_, idx) => {
        const isOwn = idx % 2 !== 0;
        return (
          <div
            key={idx}
            className={`flex items-end gap-2.5 ${
              isOwn ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="skeleton hidden size-8 shrink-0 rounded-xl sm:block" />
            <div className={`flex flex-col gap-1 ${isOwn ? "items-end" : "items-start"}`}>
              <div
                className={`skeleton h-14 ${
                  idx % 3 === 0 ? "w-44" : "w-60"
                } ${isOwn ? "rounded-3xl rounded-br-md" : "rounded-3xl rounded-bl-md"}`}
              />
              <div className="skeleton h-2.5 w-12" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageSkeleton;
