import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Archive from "./pages/Archive";
import BottomNav from "./components/BottomNav";


function App() {
  return (
    <BrowserRouter>
      <div className="max-w-md mx-auto min-h-[100dvh] bg-white relative shadow-xl overflow-hidden flex flex-col font-sans">
        
        <main className="flex-1 overflow-y-auto pb-[80px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/archive" element={<Archive />} />
          </Routes>
        </main>
        
        {/* 하단 네비게이션 바 */}
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
