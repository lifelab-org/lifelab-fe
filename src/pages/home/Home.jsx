import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import NoOngoingExperiment from "../../components/empty-state/NoOngoingExperiment";
import "./Home.css";
import Api from "../../api/Api";

export default function Home() {
  const navigate = useNavigate();
  const [experiments, setExperiments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateExperimentClick = () => {
    navigate("/createExperiment"); // 실제 실험 생성 라우터 주소에 맞게 수정하세요!
  };

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        await Api.get("/auth/me");
        console.log("로그인 상태 확인 완료");

        const res = await Api.get("/experiments/ongoing");
        console.log("실험 목록 응답:", res.data);

        const data = res.data?.success;

        if (Array.isArray(data)) {
          setExperiments(data);
        } else {
          setExperiments([]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("에러 발생:", error);

        if (error.response && error.response.status === 401) {
          navigate("/onboarding", { replace: true });
          return;
        }

        setErrorMessage(error.message);
        setIsLoading(false);
      }
    };

    fetchExperiments();
  }, [navigate]);

  if (isLoading)
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>로딩중...</div>
    );
  if (errorMessage)
    return (
      <div style={{ color: "red", padding: "20px" }}>
        에러 발생: {errorMessage}
      </div>
    );

  return (
    <div className="home-container">
      <Header />

      <main className="home-main">
        {experiments.length === 0 ? (
          <div className="empty-wrapper">
            <NoOngoingExperiment />
          </div>
        ) : (
          <div className="experiment-list">
            {experiments.map((exp) => (
              <Link
                key={exp.experimentId}
                // 💡 [여기 수정!] 주소 뒤에 클릭한 실험의 ID가 붙어서 이동하도록 템플릿 리터럴로 변경
                to={`/experimentdetail/${exp.experimentId}`}
                className={`experiment-card ${exp.dDay === 0 ? "highlight" : ""}`}
              >
                {/* 3. 왼쪽 텍스트 그룹 (제목 + 서브타이틀) */}
                <div className="card-info">
                  <h3 className="experiment-title">{exp.title}</h3>
                  {/* 백엔드 응답의 subtitle ("아직 실험 전 상태가...") 바인딩 */}
                  <p className="experiment-subtitle">{exp.subtitle}</p>
                </div>

                {/* 4. 오른쪽 D-Day 표시 (0일이면 D-Day, 그 외엔 D-5, D-31 형태로 출력) */}
                <span className="experiment-dday">
                  {exp.dDay === 0 ? "D-Day" : `D-${exp.dDay}`}
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="button-container">
          <button
            className="create-experiment-btn"
            onClick={handleCreateExperimentClick}
          >
            실험 생성
          </button>
        </div>
      </main>
    </div>
  );
}
