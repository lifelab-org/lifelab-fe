import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DetailLayout from "./layouts/DetailLayout";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Archive from "./pages/Archive";
import DailyRecord from "./pages/DailyRecord";
import RecordCondition from "./pages/RecordCondition";
import Onboarding from "./pages/onboarding/Onboarding";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/archive" element={<Archive />} />
        </Route>
        <Route element={<DetailLayout />}>
          <Route path="/record" element={<DailyRecord />} />
          <Route path="/record/condition" element={<RecordCondition />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );

}



export default App; 