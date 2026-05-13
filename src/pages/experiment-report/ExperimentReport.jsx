import React, { useState } from "react";
import "./ExperimentReport.css";

const IconRight = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#000"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const IconDown = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#000"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const IconCheck = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#000"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const ExperimentReport = () => {
  // 여러 개가 동시에 열릴 수 있도록 상태를 객체로 관리
  const [openSections, setOpenSections] = useState({
    attendance: false,
    metrics: false,
    biggest: false,
    ai: false,
  });

  // 클릭한 섹션의 현재 상태만 반전시킴
  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="report-wrapper">
      <div className="report-container">
        {/* 상단 타이틀 영역 */}
        <div className="top-header">
          <div className="title-left">
            <h1 className="main-title">밀가루 끊기</h1>
            <p className="date-text">25.12.20 ~ 25.12.27</p>
          </div>
          <div className="title-right">
            <div className="check-icon">
              <IconCheck />
            </div>
            <div className="score-text">89%</div>
          </div>
        </div>

        <div className="sub-title">실험 레포트</div>
        <hr className="divider-line" />

        {/* 4개의 토글 리스트 */}
        <div className="toggle-list">
          {/* 1. 나의 실험 출석률 */}
          <div className="toggle-item">
            <div
              className="toggle-header"
              onClick={() => toggleSection("attendance")}
            >
              <div className="toggle-header-left">
                {openSections.attendance ? <IconDown /> : <IconRight />}
                <span className="toggle-text">나의 실험 출석률</span>
              </div>
              {openSections.attendance && (
                <span className="toggle-value">80%</span>
              )}
            </div>
          </div>

          {/* 2. 지표 별 변화량 */}
          <div className="toggle-item">
            <div
              className="toggle-header"
              onClick={() => toggleSection("metrics")}
            >
              <div className="toggle-header-left">
                {openSections.metrics ? <IconDown /> : <IconRight />}
                <span className="toggle-text">지표 별 변화량</span>
              </div>
            </div>
            {openSections.metrics && (
              <div className="toggle-content">
                <div className="graph-link-box">
                  <span className="graph-link">그래프로 확인하기</span>
                </div>
                <div className="metrics-list">
                  <MetricRow
                    label="소화 상태"
                    from="5"
                    to="4.1"
                    diff="0.9↑"
                    active
                  />
                  <MetricRow
                    label="피부 상태"
                    from="4"
                    to="5.1"
                    diff="1.1↑"
                    active
                  />
                  <MetricRow
                    label="피로도"
                    from="10"
                    to="5.1"
                    diff="1.1↑"
                    active
                  />
                  <MetricRow label="기분" from="4" to="4" diff="--" />
                </div>
              </div>
            )}
          </div>

          {/* 3. 가장 변화 폭이 컸던 지표 */}
          <div className="toggle-item">
            <div
              className="toggle-header"
              onClick={() => toggleSection("biggest")}
            >
              <div className="toggle-header-left">
                {openSections.biggest ? <IconDown /> : <IconRight />}
                <span className="toggle-text">가장 변화 폭이 컸던 지표</span>
              </div>
            </div>
            {openSections.biggest && (
              <div className="toggle-content">
                <div className="biggest-change-label">피부 상태</div>
                <div className="biggest-change-cards">
                  <div className="card gray-card">
                    <span className="card-num">3</span>
                    <span className="card-desc">실험 전</span>
                  </div>
                  <span className="card-arrow">→</span>
                  <div className="card purple-card">
                    <span className="card-num">7</span>
                    <span className="card-desc">12.27</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. AI 코멘트 */}
          <div className="toggle-item">
            <div className="toggle-header" onClick={() => toggleSection("ai")}>
              <div className="toggle-header-left">
                {openSections.ai ? <IconDown /> : <IconRight />}
                <span className="toggle-text">AI 코멘트</span>
              </div>
            </div>
            {openSections.ai && (
              <div className="toggle-content">
                <div className="ai-box"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricRow = ({ label, from, to, diff, active }) => (
  <div className="metric-row">
    <div className="m-label">{label}</div>
    <div className="m-dots"></div>
    <div className="m-values">
      <span className="v-num">{from}</span>
      <span className="v-arrow">→</span>
      <span className="v-num">{to}</span>
      <span className={`v-diff ${active ? "purple-text" : "gray-text"}`}>
        {diff}
      </span>
    </div>
  </div>
);

export default ExperimentReport;
