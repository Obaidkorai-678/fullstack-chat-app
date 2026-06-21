import { useLocation, Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full bg-base-100">
      <Navbar />

      <main className="pt-16 w-full min-h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
    </div>
  );
};

export default MainLayout;