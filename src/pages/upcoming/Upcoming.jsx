import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Api from "../../api/Api";
import "./Upcoming.css";

function Upcoming() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await Api.get("/experiments/upcoming");
      const result = response.data?.success;
      if (Array.isArray(result)) {
        setData(result);
      } else if (result) {
        setData([result]);
      }
    } catch (error) {
      console.error("진행 예정 실험 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateExperimentClick = () => {
    navigate("/createExperiment");
  };

  return (
    <div>
      <Header />

      <div className="upcoming-list">
        {data.map((item) => (
          <div key={item.experimentId}>
            <h3>
              {/* 🎯 가상 요소(::before) 대신 실제 div 태그로 동그라미를 그려 색상을 다이렉트로 꽂아줌 */}
              <div
                className="color-circle"
                style={{ backgroundColor: item.color || "#A294F9" }}
              />
              {item.title}
            </h3>
            <p>{item.subtitle}</p>
            <span>{item.dDayLabel}</span>
          </div>
        ))}
      </div>

      <div className="button-container">
        <button
          className="create-experiment-btn"
          onClick={handleCreateExperimentClick}
        >
          실험 생성
        </button>
      </div>
    </div>
  );
}

export default Upcoming;
