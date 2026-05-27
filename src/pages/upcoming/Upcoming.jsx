import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 1. 페이지 이동을 위해 라우터 훅 추가
import Header from "../../components/header/Header";
import Api from "../../api/Api";
import "./Upcoming.css";

function Upcoming() {
  const navigate = useNavigate(); // 2. 네비게이트 함수 선언
  const [data, setData] = useState([]);

  // 데이터 불러오기 함수
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

  // 3. 기존의 Api.post 로직을 싹 지우고 페이지 이동 핸들러로 변경
  const handleCreateExperimentClick = () => {
    navigate("/createExperiment");
  };

  return (
    <div>
      <Header />

      <div className="upcoming-list">
        {data.map((item) => (
          <div key={item.experimentId}>
            <h3>{item.title}</h3>
            <p>{item.subtitle}</p>
            <span>{item.dDayLabel}</span>
          </div>
        ))}
      </div>

      {/* 버튼 래퍼 */}
      <div className="button-container">
        <button
          className="create-experiment-btn"
          onClick={handleCreateExperimentClick} // 4. 클릭 시 이동 함수 호출
        >
          실험 생성
        </button>
      </div>
    </div>
  );
}

export default Upcoming;
