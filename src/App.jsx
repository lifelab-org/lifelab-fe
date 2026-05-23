import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import DetailLayout from "./layouts/DetailLayout";

import Home from "./pages/home/Home";
import Calendar from "./pages/Calendar";
import Archive from "./pages/archive/Archive";
import BottomNav from "./components/BottomNav";
import Onboarding from "./pages/onboarding/Onboarding";

import RecordSuccess from "./pages/record/RecordSuccess";
import DailyRecord from "./pages/record/DailyRecord";
import RecordExitChoice from "./pages/record/RecordExitChoice";
import RecordFailReason from "./pages/record/RecordFailReason";
import RecordExit from "./pages/record/RecordExit";
import RecordCondition from "./pages/record/RecordCondition";

import CreateExperiment from "./pages/CreateExperiment/CreateExperiment";
import Created from "./pages/created/Created";
import CreatePrerecordAlert from "./pages/CreatePrerecordAlert/CreatePrerecordAlert";
import Prerecord from "./pages/Prerecord/Prerecord";
import NoOngoingExperiment from "./components/empty-state/NoOngoingExperiment";
import Upcoming from "./pages/upcoming/Upcoming";
import ExperimentDetail from "./pages/experiment-detail/ExperimentDetail";
import ArchiveDetail from "./pages/archivedetail/ArchiveDetail";
import ExperimentReport from "./pages/experiment-report/ExperimentReport";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />

        <Route
          path="/*"
          element={
            <div className="max-w-md mx-auto h-[100dvh] bg-white relative shadow-xl overflow-hidden flex flex-col font-sans">
              <main className="flex-1 overflow-y-auto">
                <Routes>
                  <Route element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="archive" element={<Archive />} />
                    <Route path="createExperiment" element={<CreateExperiment />} />
                    <Route path="created" element={<Created />} />
                    <Route path="createPrerecordAlert" element={<CreatePrerecordAlert />} />
                    <Route path="prerecord" element={<Prerecord />} />
                    <Route path="NoOngoingExperiment" element={<NoOngoingExperiment />} />
                    <Route path="upcoming" element={<Upcoming />} />
                    <Route
                      path="experimentdetail"
                      element={<ExperimentDetail />}
                    />

                    <Route
                      path="experimentreport"
                      element={<ExperimentReport />}
                    />
                  </Route>

                  <Route element={<DetailLayout />}>
                    <Route path="record" element={<DailyRecord />} />
                    <Route
                      path="record/condition"
                      element={<RecordCondition />}
                    />
                    <Route path="record/success" element={<RecordSuccess />} />
                    <Route
                      path="record/exitchoice"
                      element={<RecordExitChoice />}
                    />
                    <Route
                      path="record/failreason"
                      element={<RecordFailReason />}
                    />
                    <Route path="record/exit" element={<RecordExit />} />
                    <Route
                      path="archivedetail"
                      element={<ArchiveDetail />}
                    ></Route>
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
