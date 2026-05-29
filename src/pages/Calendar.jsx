import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import axios from "axios";
import "react-calendar/dist/Calendar.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = ["#FBE285", "#BAE59C", "#D7C2F2", "#ABC9EB"];
const MAX_BARS = 3;

// ─── Pure helpers ─────────────────────────────────────────────────────────────

function toMonthString(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

// "YYYY-MM-DD" → Date (로컬 시간 기준, timezone 오차 방지)
function parseLocalDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function getBarRadiusClass(date, startDate, endDate) {
  const roundLeft =
    date.getTime() === startDate.getTime() || date.getDay() === 0;
  const roundRight =
    date.getTime() === endDate.getTime() || date.getDay() === 6;

  if (roundLeft && roundRight) return "rounded-[4px]";
  if (roundLeft) return "rounded-l-[4px]";
  if (roundRight) return "rounded-r-[4px]";
  return "rounded-none";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [experiments, setExperiments] = useState([]);

  // ── 날짜 경계 체크 ──────────────────────────────────────────────────────────

  const isCurrentMonth =
    viewDate.getFullYear() === today.getFullYear() &&
    viewDate.getMonth() === today.getMonth();

  const oneYearAgo = new Date(today.getFullYear(), today.getMonth() - 11, 1);

  const isMinMonth =
    viewDate.getFullYear() === oneYearAgo.getFullYear() &&
    viewDate.getMonth() === oneYearAgo.getMonth();

  // 실제로 캘린더에 표시할 실험 (최대 3개, 슬롯 고정)
  const displayExperiments = experiments.slice(0, MAX_BARS);

  // ── API 호출 ────────────────────────────────────────────────────────────────

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(`/api/experiments/calendar?month=${toMonthString(viewDate)}`, {
        withCredentials: true,
        signal: controller.signal,
      })
      .then(({ data }) => {
        setExperiments(data.success?.experiments ?? []);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) setExperiments([]);
      });

    return () => controller.abort();
  }, [viewDate]);

  // ── 월 이동 핸들러 ──────────────────────────────────────────────────────────

  const handlePrevMonth = () => {
    if (isMinMonth) return;
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    if (isCurrentMonth) return;
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  // ── 날짜 칸 렌더링 ──────────────────────────────────────────────────────────

  const renderHabits = ({ date, view }) => {
    if (view !== "month") return null;

    return (
      <div className="w-full flex flex-col gap-1 mt-1">
        {displayExperiments.map((exp, idx) => {
          const start = parseLocalDate(exp.startDate);
          const end = parseLocalDate(exp.endDate);

          // 이 날짜에 실험이 없으면 빈 공간 유지 (슬롯 고정)
          if (date < start || date > end) {
            return <div key={exp.experimentId} className="w-full h-[18px]" />;
          }

          const radiusClass = getBarRadiusClass(date, start, end);
          const showTitle = date.getTime() === start.getTime();

          return (
            <div
              key={exp.experimentId}
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              className={`
                w-full h-[18px]
                text-[10px] text-[#333]
                flex items-center px-1
                overflow-hidden whitespace-nowrap
                ${radiusClass}
              `}
            >
              {showTitle ? exp.title : ""}
            </div>
          );
        })}
      </div>
    );
  };

  const getTileClassName = ({ date, view }) => {
    if (
      view === "month" &&
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    ) {
      return "today-highlight";
    }
    return null;
  };

  // ── JSX ─────────────────────────────────────────────────────────────────────

  return (
    <div className="bg-[#F9F9FB] flex flex-col items-center py-10 px-4 font-sans">

      <style>{`

        .react-calendar__month-view__days__day--neighboringMonth {
  visibility: hidden;
}
        .custom-calendar.react-calendar {
          width: 100%;
          border: none;
          background: white;
          border-radius: 24px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          font-family: inherit;
        }
        .react-calendar__navigation { display: none; }
        .react-calendar__month-view__weekdays {
          text-align: center;
          font-weight: 600;
          font-size: 15px;
          color: #333;
          margin-bottom: 12px;
        }
        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
        }
        .react-calendar__tile {
          height: 100px;
          padding: 4px 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          background: none;
        }
        .react-calendar__tile > abbr {
          margin-bottom: 2px;
          font-size: 15px;
          color: #222;
          font-weight: 500;
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .react-calendar__tile--now { background: transparent !important; }
        .react-calendar__tile--active { background: transparent !important; color: inherit; }
        .react-calendar__month-view__days__day--weekend { color: #222; }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #ffffff;
          border-radius: 8px;
        }
        .today-highlight > abbr {
          background-color: #9C8CEB;
          color: white;
          border-radius: 8px;
        }
      `}</style>

      <div className="w-full max-w-md flex flex-col items-center">

        <h1 className="text-[17px] font-bold text-[#111] mb-6">캘린더</h1>

        {/* 월 네비게이션 */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handlePrevMonth}
            disabled={isMinMonth}
            className={`flex items-center justify-center w-8 h-8 rounded-full ${isMinMonth ? "text-[#D1D1D1]" : "text-[#111]"
              }`}
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>

          <div className="text-[20px] font-bold text-[#111] min-w-[120px] text-center">
            {viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월
          </div>

          <button
            onClick={handleNextMonth}
            disabled={isCurrentMonth}
            className={`flex items-center justify-center w-8 h-8 rounded-full ${isCurrentMonth ? "text-[#D1D1D1]" : "text-[#111]"
              }`}
          >
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>
        </div>

        {/* 캘린더 */}
        <Calendar
          className="custom-calendar"
          value={viewDate}
          activeStartDate={viewDate}
          onChange={(date) =>
            setViewDate(new Date(date.getFullYear(), date.getMonth(), 1))
          }
          calendarType="gregory"
          formatDay={(locale, date) => date.getDate().toString()}
          tileContent={renderHabits}
          tileClassName={getTileClassName}
        />

        {/* 실험 목록 카드 */}
        <div className="w-full bg-white rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-5 mt-5 mb-10">
          <div className="grid grid-cols-2 gap-3">

            {displayExperiments.map((exp, idx) => (
              <button
                key={exp.experimentId}
                className="flex items-center gap-2.5 border border-[#DFD3F4] rounded-[14px] px-4 py-3.5 text-[15px] font-semibold text-[#333]"
              >
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="truncate">{exp.title}</span>
              </button>
            ))}

            <button className="flex items-center gap-2.5 border border-[#DFD3F4] rounded-[14px] px-4 py-3.5 text-[15px] font-semibold text-[#999]">
              <Plus size={18} strokeWidth={2.5} />
              항목 추가
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
