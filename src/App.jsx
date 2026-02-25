import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Archive from "./pages/Archive";

function BottomNav() {
  const location = useLocation();

  const navItem = (path, label) => (
    <Link
      to={path}
      className={`flex-1 text-center py-3 ${
        location.pathname === path ? "text-blue-500 font-bold" : "text-gray-500"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white flex">
      {navItem("/", "홈")}
      {navItem("/calendar", "캘린더")}
      {navItem("/archive", "아카이브")}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="pb-16"> 
        {/* 하단바 공간 확보 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/archive" element={<Archive />} />
        </Routes>
      </div>
      <BottomNav />
    </BrowserRouter>
  );
}