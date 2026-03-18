import { Outlet } from "react-router-dom";

export default function DetailLayout() {
  return (
    <div className="max-w-md mx-auto min-h-[100dvh] bg-white relative shadow-xl overflow-hidden flex flex-col font-sans">
      {/* 하단바가 없으므로 여백(pb)을 제거합니다 */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}