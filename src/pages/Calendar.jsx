import React, { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import axios from "axios";
import "react-calendar/dist/Calendar.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_BARS = 3;

// ─── Pure helpers ─────────────────────────────────────────────────────────────

function toMonthString(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

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

/**
 * 인터벌 기반 lane 배치 (구글 캘린더 방식).
 *
 * - 시작일 → 종료일 → experimentId 순으로 '완전 결정적'으로 정렬한다.
 *   (experimentId tiebreaker 덕분에 API 응답 순서가 바뀌어도 결과 동일)
 * - 겹치는 실험은 서로 다른 줄(lane)로, 안 겹치는 실험은 빈 줄을 재사용한다.
 * - 각 실험은 '한 번 정해진 lane'을 전 생애 동안 유지 → 날짜별로 튀지 않는다.
 *
 * 반환: 각 실험에 lane(0,1,2…)이 붙은 새 배열
 */
function assignLanes(experiments) {
  // 잘못된 구간(시작>종료) 방어: 항상 start<=end가 되도록 정규화
  const normalized = experiments.map((exp) => {
    let start = parseLocalDate(exp.startDate).getTime();
    let end = parseLocalDate(exp.endDate).getTime();
    if (end < start) [start, end] = [end, start];
    return { exp, start, end };
  });

  // 완전 결정적 정렬: 시작일 → 종료일 → experimentId
  normalized.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    if (a.end !== b.end) return a.end - b.end;
    return String(a.exp.experimentId).localeCompare(String(b.exp.experimentId));
  });

  const laneEnds = []; // laneEnds[i] = i번 줄에 마지막으로 들어간 실험의 종료일(ms)

  return normalized.map(({ exp, start, end }) => {
    // 이 실험의 시작보다 '먼저 끝난' 가장 낮은 줄을 재사용 (겹치면 못 들어감)
    let lane = laneEnds.findIndex((laneEnd) => laneEnd < start);
    if (lane === -1) {
      lane = laneEnds.length; // 빈 줄이 없으면 새 줄
      laneEnds.push(end);
    } else {
      laneEnds[lane] = end;
    }
    return { ...exp, lane };
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [experiments, setExperiments] = useState([]);

  // ── 날짜 경계 체크 ──────────────────────────────────────────────────────────

  const isMaxMonth =
    viewDate.getFullYear() === today.getFullYear() &&
    viewDate.getMonth() === 11;

  const oneYearAgo = new Date(today.getFullYear(), today.getMonth() - 11, 1);

  const isMinMonth =
    viewDate.getFullYear() === oneYearAgo.getFullYear() &&
    viewDate.getMonth() === oneYearAgo.getMonth();

  // ── API 호출 ────────────────────────────────────────────────────────────────

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(
        `https://life-lab.shop/api/experiments/calendar?month=${toMonthString(viewDate)}`,
        {
          withCredentials: true,
          signal: controller.signal,
        },
      )
      .then(({ data }) => {
        console.log("[Calendar] API 응답:", data);
        setExperiments(data.success?.experiments ?? []);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        console.error("[Calendar] API 에러:", err);
        setExperiments([]);
      });

    return () => controller.abort();
  }, [viewDate]);

  // ── lane 계산: experiments가 바뀔 때만 1회 (API 순서와 무관하게 결정적) ──────────
  const lanedExperiments = useMemo(() => assignLanes(experiments), [experiments]);

  // ── 월 이동 핸들러 ──────────────────────────────────────────────────────────

  const handlePrevMonth = () => {
    if (isMinMonth) return;
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    if (isMaxMonth) return;
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  // ── 날짜 칸 렌더링 ──────────────────────────────────────────────────────────

  const renderHabits = ({ date, view }) => {
    if (view !== "month") return null;

    // 이 날짜에 활성화된 실험 (lane 정보 포함)
    const activeExps = lanedExperiments.filter((exp) => {
      const start = parseLocalDate(exp.startDate);
      const end = parseLocalDate(exp.endDate);
      return date >= start && date <= end;
    });

    // 고정 lane으로 슬롯 채우기 → 같은 실험은 항상 같은 줄
    const slots = Array(MAX_BARS).fill(null);
    let overflowCount = 0;
    activeExps.forEach((exp) => {
      if (exp.lane < MAX_BARS) slots[exp.lane] = exp;
      else overflowCount++; // 3줄을 넘긴 실험만 +N
    });

    return (
      <div className="w-full flex flex-col gap-1 mt-1">
        {slots.map((exp, i) => {
          if (!exp) return <div key={i} className="w-full h-[18px]" />;

          const start = parseLocalDate(exp.startDate);
          const end = parseLocalDate(exp.endDate);
          const radiusClass = getBarRadiusClass(date, start, end);

          // 실험 시작일에만 타이틀 노출
          const showTitle = date.getTime() === start.getTime();

          return (
            <div
              key={exp.experimentId}
              style={{ backgroundColor: exp.color }}
              className={`w-full h-[18px] text-[10px] text-[#333] flex items-center px-1 overflow-hidden whitespace-nowrap ${radiusClass}`}
            >
              {showTitle && (
                <span className="truncate min-w-0 font-medium">{exp.title}</span>
              )}
            </div>
          );
        })}

        {/* 오버플로우 카운트 (자리 고정용 고정 높이) */}
        <div className="w-full h-[12px] text-[9px] text-[#999] text-right pr-1 leading-none mt-0.5">
          {overflowCount > 0 && `+${overflowCount}`}
        </div>
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
          height: 115px;
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
          background-color: transparent;
          cursor: default;
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
            disabled={isMaxMonth}
            className={`flex items-center justify-center w-8 h-8 rounded-full ${isMaxMonth ? "text-[#D1D1D1]" : "text-[#111]"
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
            {experiments.map((exp) => (
              <button
                key={exp.experimentId}
                className="flex items-center gap-2.5 border border-[#DFD3F4] rounded-[14px] px-4 py-3.5 text-[15px] font-semibold text-[#333]"
              >
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: exp.color }}
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