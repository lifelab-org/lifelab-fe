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
        const res = await Api.get("/experiments/ongoing");
        const successData = res.data?.success;

        if (successData && Array.isArray(successData.experiments)) {
          setExperiments(successData.experiments);
        } else if (Array.isArray(successData)) {
          setExperiments(successData);
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
                to={`/experimentdetail/${exp.experimentId}`}
                className={`experiment-card ${exp.dDay === 0 ? "highlight" : ""}`}
              >
                <div className="card-info">
                  <h3 className="experiment-title">
                    {/* 🎯 가상 요소(::before) 대신 실제 div 태그로 동그라미를 그려 색상을 다이렉트로 꽂아줌 */}
                    <div
                      className="color-circle"
                      style={{ backgroundColor: exp.color || "#A294F9" }}
                    />
                    {exp.title}
                  </h3>
                  <p className="experiment-subtitle">{exp.subtitle}</p>
                </div>

                <span className="experiment-dday">
                  {exp.dDay === 0 ? "D-Day" : `D-${exp.dDay}`}
                </span>
              </Link>
            ))}
          </div>
        )}

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
