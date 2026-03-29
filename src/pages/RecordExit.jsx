import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function RecordExit() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto">

      <div className="flex-1 flex items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-semibold leading-tight">
          내일은 꼭 <br />
          성공할 거예요!
        </h1>
      </div>

      <div className="px-6 pb-10 pt-4 bg-white">
        <button
        onClick={() => navigate("/")}
          className="w-full py-4 rounded-xl text-lg font-semibold bg-[#7F6EDB] text-white"
        >
          홈으로
        </button>
      </div>

    </div>
  );
}