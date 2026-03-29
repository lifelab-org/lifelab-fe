import React, { useState } from "react";
import "./Archive.css";
import { useNavigate } from "react-router-dom";
//import axios from "axios";

function Archive() {
  const navigate = useNavigate();
  // 더미 데이터
  //   const dummyData = [
  //     { id: 1, title: "운동 습관 만들기", date: "2026-03-01" },
  //     { id: 2, title: "아침 기상 루틴", date: "2026-03-05" },
  //   ];

  const [data, setData] = useState([]);
  const handleStart = () => {
    navigate("/");
  };

  /*
  useEffect(() => {
    const fetchArchive = async () => {
      try {
        //URL들어가는 부분
        const response = await axios.get("/api/experiments/archive");

        // 콘솔찍어서 테스트 부분
        console.log(response.data);

        // 응답
        setData(response.data);
      } catch (error) {
        console.error("아카이브 조회 실패:", error);
      }
    };

    fetchArchive();
  }, []); */

  return (
    <div>
      <div className="archive-title">아카이브</div>
      <div className="experiment-list">
        실험내역
        <hr className="line" />
      </div>
      <div className="experiments-state">
        {data.length === 0 && (
          <div className="empty-wrapper">
            <div className="empty">
              아직 완료된 실험이 없어요!
              <br />첫 실험을 시작해 보세요
            </div>

            <div className="home-navigate" onClick={handleStart}>
              홈으로 가기
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Archive;
