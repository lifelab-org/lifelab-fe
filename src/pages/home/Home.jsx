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
    navigate("/createExperiment");
  };

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        await Api.get("/auth/me");
        console.log("로그인 상태 확인 완료");

        const res = await Api.get("/experiments/ongoing");
        const successData = res.data?.success;

        let rawExperiments = [];
        if (successData && Array.isArray(successData.experiments)) {
          rawExperiments = successData.experiments;
        } else if (Array.isArray(successData)) {
          rawExperiments = successData;
        }

        // 오름차순 정렬
        const sortedExperiments = [...rawExperiments].sort(
          (a, b) => a.dDay - b.dDay,
        );
        setExperiments(sortedExperiments);

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
                to={
                  exp.dDay <= 0
                    ? `/experimentreport/${exp.experimentId}`
                    : `/experimentdetail/${exp.experimentId}`
                }
                className={`experiment-card ${exp.dDay === 0 ? "highlight" : ""}`}
              >
                <div className="card-info">
                  <h3 className="experiment-title">
                    <div
                      className="color-circle"
                      style={{ backgroundColor: exp.color || "#A294F9" }}
                    />
                    {exp.title}
                  </h3>
                  <p className="experiment-subtitle">{exp.subtitle}</p>
                </div>

                <span className="experiment-dday">
                  {/* 💡 음수 값을 절대값(Math.abs)으로 바꾸어 D--1 현상을 D+1로 올바르게 수정 */}
                  {exp.dDay === 0
                    ? "D-Day"
                    : exp.dDay < 0
                      ? `D+${Math.abs(exp.dDay)}`
                      : `D-${exp.dDay}`}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* 실험 데이터가 1개 이상일 때만 실험 생성 버튼 활성화 */}
        {experiments.length > 0 && (
          <div className="button-container">
            <button
              className="create-experiment-btn"
              onClick={handleCreateExperimentClick}
            >
              실험 생성
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
