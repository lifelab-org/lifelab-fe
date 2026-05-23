import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/header/Header";
import NoOngoingExperiment from "../../components/empty-state/NoOngoingExperiment";
import "./Home.css";

export default function Home() {
  const [experiments, setExperiments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        setIsLoading(false);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        setIsLoading(false);
      }
    };

    fetchExperiments();
  }, []);

  if (isLoading) return null;

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
