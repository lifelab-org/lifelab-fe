import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";

export default function MainLayout() {
  return (
    <div className="max-w-md mx-auto min-h-[100dvh] bg-white relative shadow-xl overflow-hidden flex flex-col font-sans">
      <main className="flex-1 overflow-y-auto pb-[80px]">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}