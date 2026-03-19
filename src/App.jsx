import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DetailLayout from "./layouts/DetailLayout";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Archive from "./pages/Archive";
import BottomNav from "./components/BottomNav";
import CreateExperiment from "./pages/CreateExperiment/CreateExperiment";
import DailyRecord from "./pages/DailyRecord";
import RecordCondition from "./pages/RecordCondition";
import Onboarding from "./pages/onboarding/Onboarding";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <BottomNav>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" elemen={<Calendar />} />
          <Route path="/archive" element={<Archive />} />
        </Route>
        <Route path="/create" element={<CreateExperiment/>}></Route>
        <Route element={<DetailLayout />}>
          <Route path="/record" element={<DailyRecord />} />
          <Route path="/record/condition" element={<RecordCondition />}></Route>
        </Route>
      </BottomNav>
      </Routes>
    </BrowserRouter>
  );

}



export default App; 