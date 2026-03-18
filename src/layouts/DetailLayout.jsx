import { Outlet } from "react-router-dom";

export default function DetailLayout() {
  return (
    <div className="max-w-md mx-auto min-h-[100dvh] bg-white relative shadow-xl overflow-hidden flex flex-col font-sans">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}