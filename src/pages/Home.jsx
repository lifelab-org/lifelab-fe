import { useState, useEffect } from "react"; // 상태 관리를 위해 추가
import { Link } from "react-router-dom";
import Header from "../components/header/Header";
import NoOngoingExperiment from "../components/empty-state/NoOngoingExperiment";

export default function Home() {
  console.log("Home 렌더됨");
  // 1. 실험 목록 상태 (초기값은 빈 상태로 유지함)
  const [experiments, setExperiments] = useState([]);
  // 2. 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 3. 나중에 API 호출할 부분임
    const fetchExperiments = async () => {
      try {
        // const response = await axios.get("/api/experiments"); // 실제 연결 시 이 코드 사용
        // setExperiments(response.data);

        // 현재는 데이터가 없는 상태 유지 (테스트용 코드임)
        //ssetExperiments([{ id: 1, title: "첫 번째 실험" }]);

        setIsLoading(false);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        setIsLoading(false);
      }
    };

    fetchExperiments();
  }, []);

  if (isLoading) return null; // 로딩 중일 때 깜빡임 방지 (선택 사항)

  return (
    <div className="flex flex-col">
      <Header />

      <main className="relative min-h-[400px]">
        {/*실험이 없을 때만 모달이 표시되는 로직임 */}
        {experiments.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <NoOngoingExperiment />
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {experiments.map((exp) => (
              <Link
                key={exp.id}
                to="/record"
                className={`block border rounded-2xl p-5 ${
                  exp.id === 1
                    ? "bg-indigo-50/50 border-indigo-100"
                    : "bg-white shadow-sm"
                }`}
              >
                <h3 className="text-lg font-bold">{exp.title}</h3>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
