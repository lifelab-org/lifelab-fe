import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function RecordCondition() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  const [ratings, setRatings] = useState({
    fatigue: null,
    concentration: null,
    mood: null,
    digestion: null,
    sleep: null,
  });

  // 설문 항목 데이터
  const categories = [
    { id: 'fatigue', label: '피로도' },
    { id: 'concentration', label: '집중력' },
    { id: 'mood', label: '기분' },
    { id: 'digestion', label: '소화 상태' },
    { id: 'sleep', label: '수면 만족도' },
  ];

  // 점수 클릭 핸들러
  const handleRating = (categoryId, value) => {
    setRatings((prev) => ({
      ...prev,
      [categoryId]: value,
    }));
  };

  // 모든 항목이 입력되었는지 확인
  const isAllAnswered = Object.values(ratings).every((val) => val !== null);

  // 제출 핸들러
  const handleSubmit = () => {
    if (!isAllAnswered) return;
    
  };

 return (
    // 1. 전체 컨테이너를 화면 꽉 차게(h-screen) 만들고 세로 정렬(flex-col)합니다.
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto relative">

      <div className="px-6 pt-6 shrink-0">
        <header className="flex items-center mb-8">
          <button onClick={() => navigate(-1)} className="p-1 -ml-2">
            <ArrowLeft size={24} />
          </button>
        </header>

        <h2 className="text-2xl font-bold leading-tight mb-6">
          오늘 나의 컨디션을 <br />
          기록해주세요    
        </h2>
      </div>

      {/* 3. 스크롤 영역 (설문 리스트) */}
      {/* flex-1로 남은 빈 공간을 모두 차지하게 하고, 넘치는 컨텐츠는 스크롤(overflow-y-auto) 처리합니다. */}
      <main className="flex-1 overflow-y-auto px-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-[#F5F5F5] rounded-[10px] p-4 mb-4">
            <h2 className="text-[16px] font-semibold text-black mb-3">
              {category.label}
            </h2>
            <div className="flex justify-between items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                const isSelected = ratings[category.id] === num;
                return (
                  <button
                    key={num}
                    onClick={() => handleRating(category.id, num)}
                    className={`w-[44px] h-[30px] flex items-center justify-center rounded-[8px] text-sm duration-200 
                      ${isSelected 
                        ? 'bg-[#7F6EDB] text-white border-[#7F6EDB]' 
                        : 'bg-white text-black border border-[#7F6EDB] 0 hover:border--[#7F6EDB]'
                      }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </main>

      {/* 다음 버튼 영역 */}
      <div className="px-6 pb-10 pt-4 bg-white shrink-0">
        <button
          onClick={handleSubmit}
          disabled={!isAllAnswered}
          className={`w-full py-4 rounded-xl text-lg font-semibold
            ${isAllAnswered 
              ? 'bg-[#7F6EDB] text-white hover:bg-[#6c5bce]' 
              : 'bg-gray-300 text-white cursor-not-allowed'
            }`}
        >
          현재 상태 기록하기
        </button>
      </div>
      
    </div>
  );
}