import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Api from "../../api/Api";
import "./Upcoming.css";

const PASTEL_COLORS = [
  "#8EECF5",
  "#70C1FF",
  "#FFE5EC",
  "#FFF3CD",
  "#B9FBC0",
  "#D2F1FA",
  "#E8AEFF",
  "#FBC4AB",
  "#D8F3DC",
  "#F0E6EF",
];

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
        {data.map((item, index) => (
          <div
            key={item.experimentId}
            style={{
              "--circle-color": PASTEL_COLORS[index % PASTEL_COLORS.length],
            }}
          >
            <h3>{item.title}</h3>
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
