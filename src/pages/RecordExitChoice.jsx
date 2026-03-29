import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function RecordExitChoice() {
  const navigate = useNavigate();

  const options = ["그래도 내 상태 기록하기","오늘은 넘기기"];

  const [selected, setSelected] = useState(null);

  const handleNext = () => {
  if (!selected) return;
};

  return (
    <div className="relative min-h-screen bg-white p-6">

      <header className="flex items-center mb-8">
        <button onClick={() => navigate(-1)} className="p-1 -ml-2">
          <ArrowLeft size={24} />
        </button>
      </header>

      <h2 className="text-2xl font-bold leading-tight mb-10">
        오늘 기록은 <br />
        여기까지 할까요?
      </h2>


      <div className="space-y-4">
        {options.map((option) => {
          const isSelected = selected === option;

          return (
            <button
              key={option}
              onClick={() => setSelected(option)}
              className={`w-full flex items-center justify-between p-5 border rounded-xl transition
                ${
                  isSelected
                    ? "border-[#7F6EDB]"
                    : "border-gray-200 "
                }`}
            >
              <span className="text-lg font-medium">{option}</span>

                <div
        className={`w-6 h-6 rounded-full flex items-center justify-center
        ${
          isSelected
            ? "bg-[#7F6EDB]"
            : "bg-gray-300"
        }`}
      >
                  <div className="w-2 h-2 bg-white rounded-full" />
                
              </div>
            </button>
          );
        })}
      </div>

      <div className="absolute bottom-10 left-0 w-full px-6">
        <button
          onClick={handleNext}
          disabled={!selected}
          className={`w-full py-4 rounded-xl text-lg font-semibold 
          ${
            selected
              ? "bg-[#7F6EDB] text-white"
              : "bg-gray-300 text-white cursor-not-allowed"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}