import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";

export default function MainLayout() {
  return (
    <div className="h-full flex flex-col">
      <main className="flex-1 overflow-y-auto pb-[80px]">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}