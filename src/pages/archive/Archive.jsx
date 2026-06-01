import React, { useState, useEffect } from "react";
import "./Archive.css";
import { useNavigate } from "react-router-dom";
import axios from "../../api/Api";
import okImage from "../../assets/ok.png";
import xImage from "../../assets/X.png";

function Archive() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const handleStart = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchArchive = async () => {
      // 🔍 1단계: 이 함수가 실행되긴 하는지 확인
      console.log("1. fetchArchive 함수가 정상적으로 시작됨!");

      try {
        const response = await axios.get("/experiments/archive", {
          withCredentials: true,
        });

        // 🔍 2단계: 서버 응답이 들어왔는지 확인
        console.log("2. 서버 응답 성공적으로 도착함! 데이터:", response.data);

        if (response.data?.success?.experiments) {
          setData(response.data.success.experiments);
        }
      } catch (error) {
        // 🔍 3단계: 만약 에러가 났다면 catch문에서 범인을 잡음
        console.log("3. 🔴 catch 블록으로 튕김! 에러 정체는 아래와 같음:");
        console.error(error); // 👈 이 에러 객체의 내용을 정확히 봐야 합니다.

        // 혹시 서버가 준 에러 응답 내용이 있는지 확인
        if (error.response) {
          console.log("서버가 뱉은 에러 응답 body:", error.response.data);
          console.log("서버가 뱉은 에러 상태 코드:", error.response.status);
        }

        setData([]);
      }
    };

    fetchArchive();
  }, []);

  return (
    <div>
      <div className="archive-title">아카이브</div>
      <div className="experiment-list">
        실험내역
        <hr className="line" />
      </div>

      <div className="experiments-state">
        {data.length === 0 ? (
          <div className="empty-wrapper">
            <div className="empty">
              아직 완료된 실험이 없어요!
              <br />첫 실험을 시작해 보세요
            </div>
            <div className="home-navigate" onClick={handleStart}>
              홈으로 이동하기
            </div>
          </div>
        ) : (
          <div className="archive-items-container">
            {data.map((experiment) => (
              <div key={experiment.experimentId} className="archive-item">
                <div className="item-info">
                  <span className="item-title">{experiment.title}</span>
                  <span className="item-date">
                    {experiment.startDate} ~ {experiment.endDate}
                  </span>
                </div>

                <div
                  className={`item-status ${experiment.isSuccess ? "success" : "fail"}`}
                >
                  <img
                    src={experiment.isSuccess ? okImage : xImage}
                    alt={experiment.isSuccess ? "성공" : "실패"}
                    className="status-icon"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Archive;
