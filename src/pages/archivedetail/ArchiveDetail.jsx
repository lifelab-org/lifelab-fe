import React, { useState } from "react";
import "./ArchiveDetail.css";

function ArchiveDetail() {
  // 더미 데이터
  const dummyData = [
    {
      id: 1,
      title: "밀가루 끊기",
      period: "25.12.20 ~ 25.12.27",
      success: true,
    },
    {
      id: 2,
      title: "술 끊기",
      period: "25.12.01 ~ 25.12.14",
      success: false,
    },
    {
      id: 3,
      title: "외식 줄이기",
      period: "25.12.01 ~ 25.12.07",
      success: true,
    },
    {
      id: 4,
      title: "물 2L 마시기",
      period: "25.11.01 ~ 25.11.30",
      success: true,
    },
  ];

  const [data, setData] = useState(dummyData);

  return (
    <div>
      <div className="archive-title">아카이브</div>

      <div className="experiment-list">
        실험 내역
        <hr className="line" />
      </div>

      <div className="archive-content">
        {data.map((item) => (
          <div className="archive-card" key={item.id}>
            <div>
              <div className="archive-card-title">{item.title}</div>
              <div className="archive-card-date">{item.period}</div>
            </div>

            <div className="archive-card-icon">{item.success ? "✓" : "✕"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArchiveDetail;
