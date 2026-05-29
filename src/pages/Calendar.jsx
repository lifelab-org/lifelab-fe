import React, { useState } from "react";
import Calendar from "react-calendar";
import { ChevronDown, Plus } from "lucide-react";
import "react-calendar/dist/Calendar.css";

export default function CalendarPage() {
  // 기준 날짜 상태 (2025년 12월)
  const [value, setValue] = useState(new Date(2025, 11, 1));

  const renderHabits = ({ date, view }) => {
    if (view !== "month" || date.getMonth() !== 11) return null;
    const day = date.getDate();
    if (day < 3) return null;

    const getRadius = (startDay, endDay) => {
      const roundLeft = day === startDay || date.getDay() === 0;
      const roundRight = day === endDay || date.getDay() === 6;
      if (roundLeft && roundRight) return "rounded-[4px]";
      if (roundLeft) return "rounded-l-[4px]";
      if (roundRight) return "rounded-r-[4px]";
      return "rounded-none";
    };

    // 슬롯을 고정해서 바가 항상 같은 높이 위치에 있도록 함
    // 슬롯2: 빨리 걷기(3-19)와 파란색(25-31)은 겹치지 않아 같은 슬롯 공유
    const slot1 = day >= 3 && day <= 28;
    const slot2Green = day >= 3 && day <= 19;
    const slot2Blue = day >= 25 && day <= 31;
    const slot3 = day >= 9 && day <= 21;

    return (
      <div className="w-full flex flex-col gap-1 mt-1">
        {slot1 ? (
          <div className={`w-full h-[18px] bg-[#FBE285] text-[10px] text-[#333] flex items-center px-1 overflow-hidden whitespace-nowrap ${getRadius(3, 28)}`}>
            {day === 3 ? "아침 운동하기" : ""}
          </div>
        ) : <div className="w-full h-[18px]" />}

        {slot2Green ? (
          <div className={`w-full h-[18px] bg-[#BAE59C] text-[10px] text-[#333] flex items-center px-1 overflow-hidden whitespace-nowrap ${getRadius(3, 19)}`}>
            {day === 3 ? "빨리 걷기" : ""}
          </div>
        ) : slot2Blue ? (
          <div className={`w-full h-[18px] bg-[#ABC9EB] ${getRadius(25, 31)}`} />
        ) : <div className="w-full h-[18px]" />}

        {slot3 ? (
          <div className={`w-full h-[18px] bg-[#D7C2F2] text-[10px] text-[#333] flex items-center px-1 overflow-hidden whitespace-nowrap ${getRadius(9, 21)}`}>
            {day === 9 ? "과자 끊기" : ""}
          </div>
        ) : <div className="w-full h-[18px]" />}
      </div>
    );
  };

  return (
    <div className="bg-[#F9F9FB] flex flex-col items-center py-10 px-4 font-sans">
      {/* react-calendar 기본 스타일을 덮어쓰는 커스텀 CSS */}
      <style>{`
        .custom-calendar.react-calendar {
          width: 100%;
          border: none;
          background: white;
          border-radius: 24px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          font-family: inherit;
        }
        /* 기본 네비게이션 숨김 (커스텀 헤더 사용) */
        .react-calendar__navigation {
          display: none;
        }
        /* 요일 스타일 */
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
        /* 각 날짜 타일 스타일 */
        .react-calendar__tile {
          height: 100px;
          padding: 4px 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          background: none;
        }
        /* 모든 날짜 숫자를 동일한 크기로 고정해 오늘 날짜만 바가 내려가는 현상 방지 */
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
        /* 오늘 날짜 스타일 (보라색 원) - 임시로 23일을 오늘처럼 보이게 처리 안함 (데이터에 따라 필요시 수정) */
        .react-calendar__tile--now {
          background: transparent !important;
        }
        .react-calendar__tile--active {
          background: transparent !important;
          color: inherit;
        }
        /* 주말 색상 등 불필요한 기본 속성 제거 */
        .react-calendar__month-view__days__day--weekend {
          color: #222;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #f9f9fb;
          border-radius: 8px;
        }
        /* 크기는 위에서 이미 지정했으므로 색상만 덮어씀 */
        .today-highlight > abbr {
          background-color: #8B5CF6;
          border-radius: 50%;
          color: white;
          font-weight: 700;
        }
      `}</style>

      <div className="w-full max-w-md flex flex-col items-center">
        {/* 상단 타이틀 */}
        <h1 className="text-[17px] font-bold text-[#111] mb-6">캘린더</h1>

        {/* 커스텀 월 선택 헤더 */}
        <button className="flex items-center gap-1.5 text-[20px] font-bold text-[#111] mb-6">
          2025년 12월
          <ChevronDown size={24} strokeWidth={2.5} />
        </button>

        {/* React Calendar 컴포넌트 */}
        <Calendar
          className="custom-calendar"
          value={value}
          onChange={setValue}
          calendarType="gregory" // 일요일부터 시작
          formatDay={(locale, date) => date.getDate().toString()} // '일' 글자 제거 (ex. 1일 -> 1)
          tileContent={renderHabits}
          tileClassName={({ date, view }) => {
            if (view === "month" && date.getMonth() === 11 && date.getDate() === 23) {
              return "today-highlight";
            }
            return null;
          }}
        />

        {/* 하단 습관 목록 및 추가 버튼 */}
        <div className="w-full bg-white rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-5 mt-5 mb-10">
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center gap-2.5 border border-[#DFD3F4] rounded-[14px] px-4 py-3.5 text-[15px] font-semibold text-[#333]">
              <div className="w-4 h-4 rounded-full bg-[#FBE285]" />
              아침 운동하기
            </button>
            <button className="flex items-center gap-2.5 border border-[#DFD3F4] rounded-[14px] px-4 py-3.5 text-[15px] font-semibold text-[#333]">
              <div className="w-4 h-4 rounded-full bg-[#BAE59C]" />
              빨리 걷기
            </button>
            <button className="flex items-center gap-2.5 border border-[#DFD3F4] rounded-[14px] px-4 py-3.5 text-[15px] font-semibold text-[#333]">
              <div className="w-4 h-4 rounded-full bg-[#D7C2F2]" />
              과자 끊기
            </button>
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