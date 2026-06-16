
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Calendar, Shield } from "lucide-react";

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-10">

      {/* CARD */}
      <div className="w-full max-w-2xl bg-base-100 shadow-xl rounded-2xl border border-base-300 overflow-hidden">

        {/* HEADER BANNER */}
        <div className="h-32 bg-gradient-to-r from-primary/80 via-secondary/80 to-accent/80" />

        {/* CONTENT */}
        <div className="px-6 pb-8 -mt-16">

          {/* AVATAR SECTION */}
          <div className="flex flex-col items-center text-center">

            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                className="w-28 h-28 rounded-full border-4 border-base-100 shadow-lg object-cover"
              />

              <label
                htmlFor="avatar-upload"
                className="absolute bottom-2 right-2 bg-base-300 hover:bg-base-200 p-2 rounded-full cursor-pointer transition"
              >
                <Camera className="w-4 h-4" />
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

            <h2 className="mt-4 text-2xl font-bold">
              {authUser.fullName}
            </h2>

            <p className="text-sm text-base-content/60">
              {authUser.email}
            </p>

            <span className="mt-3 px-3 py-1 text-xs rounded-full bg-success/20 text-success">
              Active
            </span>
          </div>

          {/* INFO GRID */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="p-4 rounded-xl bg-base-200 border border-base-300 hover:scale-[1.02] transition">
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <User size={16} />
                Full Name
              </div>
              <p className="mt-1 font-medium">
                {authUser.fullName}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-base-200 border border-base-300 hover:scale-[1.02] transition">
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <Mail size={16} />
                Email
              </div>
              <p className="mt-1 font-medium">
                {authUser.email}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-base-200 border border-base-300 hover:scale-[1.02] transition">
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <Calendar size={16} />
                Member Since
              </div>
              <p className="mt-1 font-medium">
                {authUser.createdAt?.split("T")[0]}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-base-200 border border-base-300 hover:scale-[1.02] transition">
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <Shield size={16} />
                Status
              </div>
              <p className="mt-1 font-medium text-success">
                Active
              </p>
            </div>

          </div>

          {/* BUTTON */}
          <div className="mt-8 text-center">
            <button className="btn btn-primary w-full sm:w-auto px-8 rounded-xl">
              Edit Profile (coming soon)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;