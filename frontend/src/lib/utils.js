export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatLastSeen(lastActive, isOnline) {
  if (isOnline) return "online";

  if (!lastActive) return "offline";

  const now = new Date();
  const last = new Date(lastActive);
  const diffMs = now - last;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "last seen just now";
  if (diffMin < 60) return `last seen ${diffMin} min ago`;
  if (diffHr < 24) return `last seen ${diffHr} hr ago`;

  const timeStr = last.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (diffDay === 1) return `last seen yesterday at ${timeStr}`;
  if (diffDay < 7) return `last seen ${diffDay} days ago at ${timeStr}`;

  return `last seen ${last.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;
}

export function previewMessage(message) {
  if (!message) return "";
  if (message.audio) return "🎤 Voice message";
  if (message.image && !message.text) return "📷 Photo";
  if (message.image && message.text) return `📷 ${message.text}`;
  return message.text || "";
}
