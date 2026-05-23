import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { fetchRecordItems } from "../../api/record";


export default function RecordCondition() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, experimentId, reason } = location.state ?? {};

  const [items, setItems] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!experimentId) return;
    fetchRecordItems(experimentId)
      .then((values) => {
        setItems(values);
        const initial = {};
        values.forEach(({ recordItemKey }) => { initial[recordItemKey] = null; });
        setRatings(initial);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [experimentId]);

  // 점수 클릭 핸들러
  const handleRating = (categoryId, value) => {
    setRatings((prev) => ({
      ...prev,
      [categoryId]: value,
    }));
  };

  // 모든 항목이 입력되었는지 확인
  const isAllAnswered = Object.values(ratings).every((val) => val !== null);

  //모달 창!
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 제출 핸들러
  const handleSubmit = () => {
    if (!isAllAnswered) return;

    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    navigate("/record/success", {
      state: { result, experimentId, reason, ratings },
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-400">불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center px-6 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
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

      <main className="flex-1 overflow-y-auto px-6">
        {items.map(({ recordItemKey }) => (
          <div key={recordItemKey} className="bg-[#F5F5F5] rounded-[10px] p-4 mb-4">
            <h2 className="text-[16px] font-semibold text-black mb-3">
              {recordItemKey}
            </h2>
            <div className="flex justify-between items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                const isSelected = ratings[recordItemKey] === num;
                return (
                  <button
                    key={num}
                    onClick={() => handleRating(recordItemKey, num)}
                    className={`w-[44px] h-[30px] flex items-center justify-center rounded-[8px] text-sm
                      ${isSelected
                        ? 'bg-[#7F6EDB] text-white border-[#7F6EDB]'
                        : 'bg-white text-black border border-[#7F6EDB] hover:border-[#7F6EDB]'
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

      <div className="px-6 pb-10 pt-4 bg-white shrink-0">
        <button
          onClick={handleSubmit}
          disabled={!isAllAnswered}
          className={`w-full py-4 rounded-xl text-lg font-semibold
            ${isAllAnswered
              ? 'bg-[#7F6EDB] text-white'
              : 'bg-gray-300 text-white cursor-not-allowed'
            }`}
        >
          현재 상태 기록하기
        </button>
      </div>

      {isModalOpen && (
        <RecodeCheck
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirm}
        />
      )}

    </div>
  );
}