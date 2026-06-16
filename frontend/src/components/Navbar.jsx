
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { setSelectedUser } = useChatStore();

  return (
    <header
      className="
        fixed top-0 z-50 w-full
        border-b border-base-300/50
        bg-base-100/80
        backdrop-blur-xl
        shadow-sm
      "
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">

          <Link
            to="/"
            onClick={() => setSelectedUser(null)}
            className="flex items-center gap-3 group"
          >
            {/* Logo Icon */}
            <div
              className="
                size-10 rounded-2xl
                bg-primary/10
                flex items-center justify-center

                transition-all duration-300

                group-hover:scale-110
                group-hover:-rotate-6
                group-hover:-translate-y-1

                shadow-md
                group-hover:shadow-xl
                group-hover:shadow-primary/20
              "
            >
              <MessageSquare
                className="
                  w-5 h-5 text-primary

                  transition-all duration-300

                  group-hover:rotate-12
                  group-hover:scale-110
                "
              />
            </div>

            {/* Logo Text */}
            <div className="flex flex-col leading-none">
              <h1 className="text-xl font-black tracking-wider uppercase font-sans">
                <span
                  className="
                    text-base-content
                    transition-all duration-300

                    group-hover:text-primary
                  "
                >
                  Chat
                </span>

                <span
                  className="
                    bg-gradient-to-r
                    from-primary
                    via-secondary
                    to-accent
                    bg-clip-text
                    text-transparent

                    transition-all duration-500

                    group-hover:from-accent
                    group-hover:via-primary
                    group-hover:to-secondary
                  "
                >
                  App
                </span>
              </h1>

              <span
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.3em]
                  text-base-content/50
                  font-semibold

                  transition-all duration-300
                  group-hover:text-primary
                "
              >
                Real Time Chat
              </span>
            </div>
          </Link>

          {/* Right Side Buttons */}
          {authUser && (
            <div className="flex items-center gap-2">
              
              {/* Settings */}
              <Link
                to="/settings"
               className="
  btn btn-sm gap-2

  transition-all duration-300 ease-out

  hover:-translate-y-1
  hover:scale-[1.02]

  hover:shadow-lg

  active:translate-y-0
  active:scale-100
"
              >
                <Settings
                  className="
                    w-4 h-4
                    transition-all duration-300
                    hover:rotate-12
                  "
                />
                <span className="hidden sm:inline">
                  Settings
                </span>
              </Link>

              {/* Profile */}
              <Link
                to="/profile"
               className="
  btn btn-sm gap-2

  transition-all duration-300 ease-out

  hover:-translate-y-1
  hover:scale-[1.02]

  hover:shadow-lg

  active:translate-y-0
  active:scale-100
"
              >
                <User
                  className="
                    w-4 h-4
                    transition-all duration-300
                    hover:rotate-12
                  "
                />
                <span className="hidden sm:inline">
                  Profile
                </span>
              </Link>

              {/* Logout */}
            {/* Logout */}
<button
  onClick={logout}
 className="
  btn btn-sm gap-2

  transition-all duration-300 ease-out

  hover:-translate-y-1
  hover:scale-[1.02]

  hover:shadow-lg

  active:translate-y-0
  active:scale-100
"
>
  <LogOut
    className="
      w-4 h-4
      transition-all duration-300
      hover:rotate-12
    "
  />
  <span className="hidden sm:inline">
    Logout
  </span>
</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;