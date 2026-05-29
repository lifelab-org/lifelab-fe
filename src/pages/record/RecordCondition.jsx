import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import RecodeCheck from "../../components/RecodeCheck";
import Api from "../../api/Api";

export default function RecordCondition() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const experimentId = location.state?.experimentId;

  const [categories, setCategories] = useState([]);
  const [ratings, setRatings] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log("experimentId:", experimentId);
    if (!experimentId) return;

    Api.get(`/experiments/${experimentId}/daily-record/items`)
      .then((res) => {
        const values = res.data?.success?.values ?? [];
        setCategories(values.map((v) => v.recordItemKey).reverse());
        setRatings(Object.fromEntries(values.map((v) => [v.recordItemKey, null])));
      })
      .catch((err) => {
        console.error("기록 항목 조회 실패:", err);
      });
  }, [experimentId]);

  const handleRating = (key, value) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const isAllAnswered = categories.length > 0 && Object.values(ratings).every((v) => v !== null);

  const handleSubmit = () => {
    if (!isAllAnswered) return;
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    navigate("/record/success", { state: { result, ratings, experimentId } });
  };

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
        {categories.map((key) => (
          <div key={key} className="bg-[#F5F5F5] rounded-[10px] p-4 mb-4">
            <h2 className="text-[16px] font-semibold text-black mb-3">{key}</h2>
            <div className="flex justify-between items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                const isSelected = ratings[key] === num;
                return (
                  <button
                    key={num}
                    onClick={() => handleRating(key, num)}
                    className={`w-[44px] h-[30px] flex items-center justify-center rounded-[8px] text-sm
                      ${isSelected
                        ? "bg-[#7F6EDB] text-white border-[#7F6EDB]"
                        : "bg-white text-black border border-[#7F6EDB] hover:border-[#7F6EDB]"
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
              ? "bg-[#7F6EDB] text-white"
              : "bg-gray-300 text-white cursor-not-allowed"
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
