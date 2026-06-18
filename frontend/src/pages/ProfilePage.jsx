import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Calendar, Shield, Loader2 } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);

      await updateProfile({
        profilePic: base64Image,
      });
    };
  };

  const infoCards = [
    { icon: User, label: "Full Name", value: authUser.fullName },
    { icon: Mail, label: "Email", value: authUser.email },
    {
      icon: Calendar,
      label: "Member Since",
      value: authUser.createdAt?.split("T")[0],
    },
    { icon: Shield, label: "Status", value: "Active", accent: true },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-24">
      <div className="panel w-full max-w-2xl overflow-hidden rounded-4xl">
        {/* HEADER BANNER */}
        <div className="relative h-36 bg-gradient-to-br from-primary via-secondary to-accent">
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_45%)]" />
        </div>

        {/* CONTENT */}
        <div className="-mt-16 px-6 pb-8">
          {/* AVATAR */}
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt={authUser.fullName}
                className="size-28 rounded-4xl border-4 border-base-100 object-cover shadow-xl"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute -bottom-1 -right-1 grid size-10 place-items-center rounded-2xl bg-primary text-primary-content shadow-lg transition-transform hover:scale-110 ${
                  isUpdatingProfile
                    ? "cursor-not-allowed opacity-70"
                    : "cursor-pointer"
                }`}
              >
                {isUpdatingProfile ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Camera className="size-4" />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </div>

            <h2 className="mt-4 font-display text-2xl font-extrabold">
              {authUser.fullName}
            </h2>
            <p className="text-sm text-base-content/60">{authUser.email}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
              <span className="size-1.5 rounded-full bg-green-500" />
              Active
            </span>
          </div>

          {/* INFO GRID */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {infoCards.map((card) => (
              <div
                key={card.label}
                className="rounded-3xl border border-base-content/8 bg-base-200/50 p-4 lift"
              >
                <div className="flex items-center gap-2 text-sm text-base-content/55">
                  <card.icon size={16} />
                  {card.label}
                </div>
                <p
                  className={`mt-1.5 font-semibold ${
                    card.accent ? "text-green-600 dark:text-green-400" : ""
                  }`}
                >
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          {/* BUTTON */}
          <div className="mt-8 text-center">
            <button className="rounded-2xl bg-base-content/5 px-8 py-3 font-medium text-base-content/60 transition-colors hover:bg-base-content/10">
              Edit Profile (coming soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
