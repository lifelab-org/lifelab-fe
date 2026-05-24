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

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        await Api.get("/auth/me");
        console.log("로그인 상태 확인 완료 🎉");

        const res = await Api.get("/experiments/ongoing");
        console.log("실험 목록 응답:", res.data);

        const data = res.data.data;

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
                key={exp.id}
                to="/record"
                className={`experiment-card ${exp.id === 1 ? "highlight" : ""}`}
              >
                <h3 className="experiment-title">{exp.title}</h3>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
