import React, { useState, useEffect } from "react";
import "./Archive.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
      try {
        const response = await axios.get("/experiments/archive", {
          withCredentials: true,
        });

        if (
          response.data &&
          response.data.success &&
          response.data.success.experiments
        ) {
          setData(response.data.success.experiments);
        }
      } catch (error) {
        console.error("아카이브 조회 실패:", error);
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
                    className="status-icon" /* CSS에서 크기(width, height) 조절을 위해 클래스 추가 */
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
