



// import { useState } from "react";
// import { useAuthStore } from "../store/useAuthStore";
// import {
//   Camera,
//   Mail,
//   Calendar,
//   Shield,
//   Loader2,
//   Edit3,
//   Save,
//   X,
//   Eye,
//   User,
//   CheckCircle2,
// } from "lucide-react";
// import { Link } from "react-router-dom";

// const ProfilePage = () => {
//   const { authUser, updateDetails, isUpdatingDetails } = useAuthStore();

//   const [editing, setEditing] = useState(false);
//   const [fullName, setFullName] = useState(authUser?.fullName || "");
//   const [bio, setBio] = useState(authUser?.bio || "");

//   const handleSave = async () => {
//     await updateDetails({ fullName, bio });
//     setEditing(false);
//   };

//   return (
// <div className="min-h-screen w-full overflow-y-auto flex justify-center px-3 sm:px-6 py-6 sm:py-8 pb-24 bg-base-100">
//         <div className="rounded-3xl overflow-hidden shadow-xl bg-base-100 border border-base-200">

//           {/* HEADER */}
//           <div className="h-28 sm:h-36 bg-gradient-to-r from-primary to-secondary" />

//           {/* BODY */}
//           <div className="px-4 sm:px-8 pb-8 -mt-14 text-center">

//             {/* AVATAR */}
//             <div className="relative inline-block">
//               <img
//                 src={authUser?.profilePic || "/avatar.png"}
// className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl border-4 border-base-100 object-cover"              />

//               <label className="absolute bottom-0 right-0 bg-primary p-2 rounded-xl cursor-pointer shadow-md">
//                 <Camera size={14} />
//                 <input type="file" className="hidden" />
//               </label>
//             </div>

//             {/* NAME / BIO */}
//             {editing ? (
//               <div className="mt-5 space-y-3 max-w-md mx-auto">

//                 <input
//                   className="w-full rounded-xl bg-base-200 px-4 py-3 text-center outline-none border border-base-300 focus:border-primary"
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   placeholder="Full name"
//                 />

//                 <textarea
//                   className="w-full rounded-xl bg-base-200 px-4 py-3 text-center outline-none resize-none border border-base-300 focus:border-primary"
//                   value={bio}
//                   onChange={(e) => setBio(e.target.value)}
//                   placeholder="Bio..."
//                   maxLength={160}
//                 />

//                 <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
//                   <button
//                     onClick={handleSave}
//                     disabled={isUpdatingDetails}
//                     className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl w-full sm:w-auto"
//                   >
//                     {isUpdatingDetails ? (
//                       <Loader2 className="size-4 animate-spin" />
//                     ) : (
//                       <Save className="size-4" />
//                     )}
//                     Save
//                   </button>

//                   <button
//                     onClick={() => setEditing(false)}
//                     className="flex items-center justify-center gap-2 bg-base-200 px-5 py-2.5 rounded-xl w-full sm:w-auto"
//                   >
//                     <X className="size-4" />
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <h1 className="mt-4 text-xl sm:text-3xl font-bold break-words">
//                   {authUser?.fullName}
//                 </h1>

//                 <p className="mt-2 text-sm sm:text-base text-base-content/60 break-words">
//                   {authUser?.bio || "Available"}
//                 </p>

//                 <button
//                   onClick={() => setEditing(true)}
//                   className="mt-5 inline-flex items-center gap-2 bg-base-200 hover:bg-base-300 px-5 py-2.5 rounded-xl"
//                 >
//                   <Edit3 size={16} />
//                   Edit Profile
//                 </button>
//               </>
//             )}

//             {/* INFO GRID */}
//             <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">

//               <InfoCard icon={Mail} label="Email" value={authUser?.email} />

//               <InfoCard icon={Eye} label="Last Seen" value="Online" />

//               <InfoCard
//                 icon={Calendar}
//                 label="Member Since"
//                 value={
//                   authUser?.createdAt
//                     ? new Date(authUser.createdAt).toLocaleDateString()
//                     : ""
//                 }
//               />

//               <InfoCard icon={Shield} label="Account" value="Active" accent />

//               <InfoCard icon={User} label="Full Name" value={authUser?.fullName} />

//               <InfoCard
//                 icon={CheckCircle2}
//                 label="Status"
//                 value={authUser?.statusMessage || "Available"}
//                 accent
//               />

//             </div>

//             {/* FOOTER LINK */}
//             <div className="mt-8">
//               <Link
//                 to="/settings"
// className="inline-flex items-center justify-center gap-2 bg-primary/10 text-primary px-4 sm:px-6 py-3 rounded-xl hover:bg-primary/20 text-sm sm:text-base text-center max-w-full"              >
//                 <Shield size={16} />
//               Manage Privacy & Settings
//               </Link>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* CARD */
// const InfoCard = ({ icon: Icon, label, value, accent }) => (
//   <div className="rounded-xl bg-base-200/70 p-3 border border-base-300">
//     <div className="flex items-center gap-2 text-xs text-base-content/60">
//       <Icon size={13} />
//       {label}
//     </div>

//     <div
//       className={`mt-1 text-sm font-semibold break-words ${
//         accent ? "text-green-500" : ""
//       }`}
//     >
//       {value}
//     </div>
//   </div>
// );

// export default ProfilePage;





// import { useState } from "react";
// import { useAuthStore } from "../store/useAuthStore";
// import {
// Camera,
// Mail,
// Calendar,
// Shield,
// Loader2,
// Edit3,
// Save,
// X,
// Eye,
// User,
// CheckCircle2,
// } from "lucide-react";
// import { Link } from "react-router-dom";

// const ProfilePage = () => {
// const {
//   authUser,
//   updateProfile,
//   updateDetails,
//   isUpdatingDetails,
//   isUpdatingProfile,
// } = useAuthStore();
// const [editing, setEditing] = useState(false);
// const [fullName, setFullName] = useState(authUser?.fullName || "");
// const [bio, setBio] = useState(authUser?.bio || "");

// const handleSave = async () => {
// await updateDetails({ fullName, bio });
// setEditing(false);
// };
// const handleImageUpload = async (e) => {
//   const file = e.target.files?.[0];
//   if (!file) return;

//   const reader = new FileReader();

//   reader.readAsDataURL(file);

//   reader.onload = async () => {
//     await updateProfile({
//       profilePic: reader.result,
//     });
//   };
// };
// return ( <div className="min-h-screen w-full overflow-y-auto flex justify-center px-3 sm:px-6 py-6 sm:py-8 pb-24 bg-base-100"> <div className="w-full max-w-2xl"> <div className="rounded-3xl overflow-hidden shadow-xl bg-base-100 border border-base-200">
// {/* HEADER */} <div className="h-28 sm:h-36 bg-gradient-to-r from-primary to-secondary" />


//       {/* BODY */}
//       <div className="px-4 sm:px-8 pb-8 -mt-14 text-center">
//         {/* AVATAR */}
//         <div className="relative inline-block">
//           <img
//             src={authUser?.profilePic || "/avatar.png"}
//             alt="Profile"
//             className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl border-4 border-base-100 object-cover"
//           />

//          <label className="absolute bottom-0 right-0 bg-primary p-2 rounded-xl cursor-pointer shadow-md">
//   {isUpdatingProfile ? (
//     <Loader2 size={14} className="animate-spin" />
//   ) : (
//     <Camera size={14} />
//   )}

//   <input
//     type="file"
//     accept="image/*"
//     className="hidden"
//     onChange={handleImageUpload}
//   />
// </label>
//         </div>

//         {/* EDIT MODE */}
//         {editing ? (
//           <div className="mt-5 space-y-3 max-w-md mx-auto">
//             <input
//               className="w-full rounded-xl bg-base-200 px-4 py-3 text-center outline-none border border-base-300 focus:border-primary"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               placeholder="Full name"
//             />

//             <textarea
//               className="w-full rounded-xl bg-base-200 px-4 py-3 text-center outline-none resize-none border border-base-300 focus:border-primary"
//               value={bio}
//               onChange={(e) => setBio(e.target.value)}
//               placeholder="Bio..."
//               maxLength={160}
//               rows={4}
//             />

//             <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
//               <button
//                 onClick={handleSave}
//                 disabled={isUpdatingDetails}
//                 className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl w-full sm:w-auto"
//               >
//                 {isUpdatingDetails ? (
//                   <Loader2 className="size-4 animate-spin" />
//                 ) : (
//                   <Save className="size-4" />
//                 )}
//                 Save
//               </button>

//               <button
//                 onClick={() => setEditing(false)}
//                 className="flex items-center justify-center gap-2 bg-base-200 px-5 py-2.5 rounded-xl w-full sm:w-auto"
//               >
//                 <X className="size-4" />
//                 Cancel
//               </button>
//             </div>
//           </div>
//         ) : (
//           <>
//             <h1 className="mt-4 text-xl sm:text-3xl font-bold break-words">
//               {authUser?.fullName}
//             </h1>

//             <p className="mt-2 text-sm sm:text-base text-base-content/60 break-words">
//               {authUser?.bio || "Available"}
//             </p>

//             <button
//               onClick={() => setEditing(true)}
//               className="mt-5 inline-flex items-center gap-2 bg-base-200 hover:bg-base-300 px-5 py-2.5 rounded-xl"
//             >
//               <Edit3 size={16} />
//               Edit Profile
//             </button>
//           </>
//         )}

//         {/* INFO GRID */}
//         <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
//           <InfoCard
//             icon={Mail}
//             label="Email"
//             value={authUser?.email}
//           />

//           <InfoCard
//             icon={Eye}
//             label="Last Seen"
//             value="Online"
//           />

//           <InfoCard
//             icon={Calendar}
//             label="Member Since"
//             value={
//               authUser?.createdAt
//                 ? new Date(authUser.createdAt).toLocaleDateString()
//                 : ""
//             }
//           />

//           <InfoCard
//             icon={Shield}
//             label="Account"
//             value="Active"
//             accent
//           />

//           <InfoCard
//             icon={User}
//             label="Full Name"
//             value={authUser?.fullName}
//           />

//           <InfoCard
//             icon={CheckCircle2}
//             label="Status"
//             value={authUser?.statusMessage || "Available"}
//             accent
//           />
//         </div>

//         {/* FOOTER LINK */}
//         <div className="mt-8">
//           <Link
//             to="/settings"
//             className="inline-flex items-center justify-center gap-2 bg-primary/10 text-primary px-4 sm:px-6 py-3 rounded-xl hover:bg-primary/20 text-sm sm:text-base text-center max-w-full"
//           >
//             <Shield size={16} />
//             Manage Privacy & Settings
//           </Link>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>


// );
// };

// const InfoCard = ({ icon: Icon, label, value, accent }) => (

//   <div className="rounded-xl bg-base-200/70 p-3 sm:p-4 border border-base-300 min-w-0">
//     <div className="flex items-center gap-2 text-xs text-base-content/60">
//       <Icon size={13} />
//       {label}
//     </div>

//     <div
//       className={`mt-1 text-sm font-semibold break-all ${
//         accent ? "text-green-500" : ""
//       }`}
//     >
//       {value}
//     </div>

//   </div>
// );

// export default ProfilePage;

// import { useState } from "react";
// import { useAuthStore } from "../store/useAuthStore";
// import {
//   Camera,
//   Mail,
//   Calendar,
//   Shield,
//   Loader2,
//   Edit3,
//   Save,
//   X,
//   Eye,
//   User,
//   CheckCircle2,
// } from "lucide-react";
// import { Link } from "react-router-dom";

// const ProfilePage = () => {
//   const {
//     authUser,
//     updateProfile,
//     updateDetails,
//     isUpdatingDetails,
//     isUpdatingProfile,
//   } = useAuthStore();

//   const [editing, setEditing] = useState(false);
//   const [fullName, setFullName] = useState(authUser?.fullName || "");
//   const [bio, setBio] = useState(authUser?.bio || "");

//   const handleSave = async () => {
//     await updateDetails({ fullName, bio });
//     setEditing(false);
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.readAsDataURL(file);

//     reader.onload = async () => {
//       await updateProfile({
//         profilePic: reader.result,
//       });
//     };
//   };

//   return (
// <div className="min-h-screen w-full flex flex-col sm:items-center px-3 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-10 bg-base-100">      {/* wrapper */}
//       <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl">
//         <div className="rounded-3xl overflow-hidden shadow-xl bg-base-100 border border-base-200 lg:shadow-2xl scale-100 sm:scale-[0.98]">

//           {/* HEADER */}
// <div className="h-20 sm:h-36 bg-gradient-to-r from-primary to-secondary" />
//           {/* BODY */}
//           <div className="px-4 sm:px-8 lg:px-10 pb-8 -mt-14 text-center">

//             {/* AVATAR */}
//             <div className="relative inline-block">
//               <img
//                 src={authUser?.profilePic || "/avatar.png"}
//                 alt="Profile"
//                 className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 lg:w-28 rounded-2xl border-4 border-base-100 object-cover"
//               />

//               <label className="absolute bottom-0 right-0 bg-primary p-2 rounded-xl cursor-pointer shadow-md">
//                 {isUpdatingProfile ? (
//                   <Loader2 size={14} className="animate-spin" />
//                 ) : (
//                   <Camera size={14} />
//                 )}

//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={handleImageUpload}
//                 />
//               </label>
//             </div>

//             {/* EDIT MODE */}
//             {editing ? (
//               <div className="mt-5 space-y-3 max-w-md mx-auto">
//                 <input
//                   className="w-full rounded-xl bg-base-200 px-4 py-3 text-center outline-none border border-base-300 focus:border-primary"
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   placeholder="Full name"
//                 />

//                 <textarea
//                   className="w-full rounded-xl bg-base-200 px-4 py-3 text-center outline-none resize-none border border-base-300 focus:border-primary"
//                   value={bio}
//                   onChange={(e) => setBio(e.target.value)}
//                   placeholder="Bio..."
//                   maxLength={160}
//                   rows={4}
//                 />

//                 <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
//                   <button
//                     onClick={handleSave}
//                     disabled={isUpdatingDetails}
//                     className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl w-full sm:w-auto"
//                   >
//                     {isUpdatingDetails ? (
//                       <Loader2 className="size-4 animate-spin" />
//                     ) : (
//                       <Save className="size-4" />
//                     )}
//                     Save
//                   </button>

//                   <button
//                     onClick={() => setEditing(false)}
//                     className="flex items-center justify-center gap-2 bg-base-200 px-5 py-2.5 rounded-xl w-full sm:w-auto"
//                   >
//                     <X className="size-4" />
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <h1 className="mt-4 text-xl sm:text-3xl font-bold break-words">
//                   {authUser?.fullName}
//                 </h1>

//                 <p className="mt-2 text-sm sm:text-base text-base-content/60 break-words">
//                   {authUser?.bio || "Available"}
//                 </p>

//                 <button
//                   onClick={() => setEditing(true)}
//                   className="mt-5 inline-flex items-center gap-2 bg-base-200 hover:bg-base-300 px-5 py-2.5 rounded-xl"
//                 >
//                   <Edit3 size={16} />
//                   Edit Profile
//                 </button>
//               </>
//             )}

//             {/* INFO GRID */}
//             <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
//               <InfoCard icon={Mail} label="Email" value={authUser?.email} />
//               <InfoCard icon={Eye} label="Last Seen" value="Online" />
//               <InfoCard
//                 icon={Calendar}
//                 label="Member Since"
//                 value={
//                   authUser?.createdAt
//                     ? new Date(authUser.createdAt).toLocaleDateString()
//                     : ""
//                 }
//               />
//               <InfoCard icon={Shield} label="Account" value="Active" accent />
//               <InfoCard icon={User} label="Full Name" value={authUser?.fullName} />
//               <InfoCard
//                 icon={CheckCircle2}
//                 label="Status"
//                 value={authUser?.statusMessage || "Available"}
//                 accent
//               />
//             </div>

//             {/* FOOTER */}
//             <div className="mt-8">
//               <Link
//                 to="/settings"
//                 className="inline-flex items-center justify-center gap-2 bg-primary/10 text-primary px-4 sm:px-6 py-3 rounded-xl hover:bg-primary/20 text-sm sm:text-base"
//               >
//                 <Shield size={16} />
//                 Manage Privacy & Settings
//               </Link>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const InfoCard = ({ icon: Icon, label, value, accent }) => (
//   <div className="rounded-xl bg-base-200/70 p-3 sm:p-4 border border-base-300 min-w-0">
//     <div className="flex items-center gap-2 text-xs text-base-content/60">
//       <Icon size={13} />
//       {label}
//     </div>

//     <div
//       className={`mt-1 text-sm font-semibold break-all ${
//         accent ? "text-green-500" : ""
//       }`}
//     >
//       {value}
//     </div>
//   </div>
// );

// export default ProfilePage;




import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Camera,
  Mail,
  Calendar,
  Shield,
  Loader2,
  Edit3,
  Save,
  X,
  Eye,
  User,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const {
    authUser,
    updateProfile,
    updateDetails,
    isUpdatingDetails,
    isUpdatingProfile,
  } = useAuthStore();

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");

  const handleSave = async () => {
    await updateDetails({ fullName, bio });
    setEditing(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      await updateProfile({
        profilePic: reader.result,
      });
    };
  };

  return (
    <div className="min-h-screen w-full flex flex-col sm:items-center px-3 sm:px-6 pt-16 sm:pt-24 pb-20 sm:pb-10 bg-base-100">

      {/* WRAPPER */}
      <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl">

        <div className="rounded-3xl overflow-hidden shadow-xl bg-base-100 border border-base-200 scale-100 sm:scale-[0.98]">

          {/* HEADER (reduced height for mobile fix) */}
          <div className="h-20 sm:h-36 bg-gradient-to-r from-primary to-secondary" />

          {/* BODY */}
          <div className="px-4 sm:px-8 lg:px-10 pb-6 -mt-12 text-center">

            {/* AVATAR */}
            <div className="relative inline-block">
              <img
                src={authUser?.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 lg:w-28 rounded-2xl border-4 border-base-100 object-cover"
              />

              <label className="absolute bottom-0 right-0 bg-primary p-2 rounded-xl cursor-pointer shadow-md">
                {isUpdatingProfile ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Camera size={14} />
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {/* EDIT MODE */}
            {editing ? (
              <div className="mt-4 space-y-3 max-w-md mx-auto">
                <input
                  className="w-full rounded-xl bg-base-200 px-4 py-3 text-center outline-none border border-base-300 focus:border-primary"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name"
                />

                <textarea
                  className="w-full rounded-xl bg-base-200 px-4 py-3 text-center outline-none resize-none border border-base-300 focus:border-primary"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Bio..."
                  maxLength={160}
                  rows={3}
                />

                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                  <button
                    onClick={handleSave}
                    disabled={isUpdatingDetails}
                    className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl w-full sm:w-auto"
                  >
                    {isUpdatingDetails ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Save className="size-4" />
                    )}
                    Save
                  </button>

                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center justify-center gap-2 bg-base-200 px-5 py-2.5 rounded-xl w-full sm:w-auto"
                  >
                    <X className="size-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="mt-3 text-xl sm:text-3xl font-bold break-words">
                  {authUser?.fullName}
                </h1>

                <p className="mt-2 text-sm sm:text-base text-base-content/60 break-words">
                  {authUser?.bio || "Available"}
                </p>

                <button
                  onClick={() => setEditing(true)}
                  className="mt-4 inline-flex items-center gap-2 bg-base-200 hover:bg-base-300 px-5 py-2.5 rounded-xl"
                >
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              </>
            )}

            {/* INFO GRID */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <InfoCard icon={Mail} label="Email" value={authUser?.email} />
              <InfoCard icon={Eye} label="Last Seen" value="Online" />
              <InfoCard
                icon={Calendar}
                label="Member Since"
                value={
                  authUser?.createdAt
                    ? new Date(authUser.createdAt).toLocaleDateString()
                    : ""
                }
              />
              <InfoCard icon={Shield} label="Account" value="Active" accent />
              <InfoCard icon={User} label="Full Name" value={authUser?.fullName} />
              <InfoCard
                icon={CheckCircle2}
                label="Status"
                value={authUser?.statusMessage || "Available"}
                accent
              />
            </div>

            {/* FOOTER BUTTON (FIXED VISIBILITY) */}
            <div className="mt-6 pb-2">
              <Link
                to="/settings"
                className="inline-flex items-center justify-center gap-2 bg-primary/10 text-primary px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-primary/20 text-sm sm:text-base"
              >
                <Shield size={16} />
                Manage Privacy & Settings
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value, accent }) => (
  <div className="rounded-xl bg-base-200/70 p-3 sm:p-4 border border-base-300 min-w-0">
    <div className="flex items-center gap-2 text-xs text-base-content/60">
      <Icon size={13} />
      {label}
    </div>

    <div
      className={`mt-1 text-sm font-semibold break-all ${
        accent ? "text-green-500" : ""
      }`}
    >
      {value}
    </div>
  </div>
);

export default ProfilePage;