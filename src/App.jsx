import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import DetailLayout from "./layouts/DetailLayout"

import Home from "./pages/home/Home";
import Calendar from "./pages/Calendar";
import Archive from "./pages/archive/Archive";
import BottomNav from "./components/BottomNav";
import Onboarding from "./pages/onboarding/Onboarding";

import DailyRecord from "./pages/DailyRecord/DailyRecord";
import RecordCondition from "./pages/DailyRecord/RecordCondition";
import RecordSuccess from "./pages/DailyRecord/RecordSuccess";
import RecordExitChoice from "./pages/DailyRecord/RecordExitChoice";
import RecordFailReason from "./pages/DailyRecord/RecordFailReason";
import RecordExit from "./pages/DailyRecord/RecordExit";


import CreateExperiment from "./pages/CreateExperiment/CreateExperiment";
import Created from "./pages/created/Created";
import NoOngoingExperiment from "./components/empty-state/NoOngoingExperiment";
import Upcoming from "./pages/upcoming/Upcoming";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />

        <Route
          path="/*"
          element={
            <div className="max-w-md mx-auto min-h-[100dvh] bg-white relative shadow-xl overflow-hidden flex flex-col font-sans">
              <main className="flex-1 overflow-y-auto">
                <Routes>

                  <Route element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="archive" element={<Archive />} />
                    <Route path="create" element={<CreateExperiment />} />
                    <Route path="created" element={<Created />} />
                    <Route path="NoOngoingExperiment" element={<NoOngoingExperiment />} />
                    <Route path="upcoming" element={<Upcoming />} />
                  </Route>

                  <Route element={<DetailLayout />}>
                    <Route path="record" element={<DailyRecord />} />
                    <Route path="record/condition" element={<RecordCondition />} />
                    <Route path="record/success" element={<RecordSuccess />} />
                    <Route path="record/exitchoice" element={<RecordExitChoice />} />
                    <Route path="record/failreason" element={<RecordFailReason />} />
                    <Route path="record/exit" element={<RecordExit />} />
                  </Route>
                </Routes>
              </main>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
