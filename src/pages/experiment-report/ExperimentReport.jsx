import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../../api/Api"; // 프로젝트 내의 Api 인스턴스 경로에 맞게 확인해주세요!
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
  const { experimentId } = useParams();
  const navigate = useNavigate();

  const [reportData, setReportData] = useState({
    successInfo: null, // 성공률 및 기본 타이틀 정보
    attendanceRate: 0, // 출석률
    metricsList: [], // 지표별 변화량
    topMetric: null, // 가장 변화 폭이 컸던 지표
    aiComment: "", // AI 코멘트
  });

  const [isLoading, setIsLoading] = useState(true);
  const [openSections, setOpenSections] = useState({
    attendance: false,
    metrics: false,
    biggest: false,
    ai: false,
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);

        const [
          successRes,
          attendanceRes,
          metricsRes,
          topMetricRes,
          commentRes,
        ] = await Promise.all([
          Api.get(`/experiments/${experimentId}/success`),
          Api.get(`/experiments/${experimentId}/attendance`),
          Api.get(`/experiments/${experimentId}/archive/metrics`),
          Api.get(`/experiments/${experimentId}/archive/metrics/top`),
          Api.get(`/experiments/${experimentId}/comment`),
        ]);

        const experimentInfo =
          successRes.data?.success?.experiments?.find(
            (exp) => String(exp.experimentId) === String(experimentId),
          ) || successRes.data?.success?.experiments?.[0];

        setReportData({
          successInfo: experimentInfo || null,
          attendanceRate: attendanceRes.data?.success?.attendanceRate || 0,
          metricsList: metricsRes.data?.success?.metrics || [],
          topMetric: topMetricRes.data?.success || null,
          aiComment:
            commentRes.data?.success?.comment || "분석된 코멘트가 없습니다.",
        });
      } catch (error) {
        console.error("레포트 데이터를 가져오는 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (experimentId) {
      fetchReportData();
    }
  }, [experimentId]);

  // 3. 하단 결과 확인 완료 처리 기능 연결 (POST)
  const handleResultCheck = async () => {
    try {
      const res = await Api.post(`/experiments/${experimentId}/result-check`);
      if (res.data?.result === "Success") {
        alert("실험 결과 확인이 완료되었습니다!");
        navigate("/"); // 확인 후 메인 홈으로 이동 처리 예시
      }
    } catch (error) {
      console.error("결과 확인 완료 처리 중 오류 발생:", error);
      alert(
        error.response?.data?.error?.message || "처리 중 오류가 발생했습니다.",
      );
    }
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (isLoading) {
    return (
      <div style={{ padding: "50px", textAlign: "center", color: "#666" }}>
        AI 리포트 분석 및 로딩 중...
      </div>
    );
  }

  // 날짜 포맷팅용 함수 (2025-12-20 -> 25.12.20)
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return dateStr.replace(/^\d{2}(\d{2})-(\d{2})-(\d{2})$/, "$1.$2.$3");
  };

  const { successInfo, attendanceRate, metricsList, topMetric, aiComment } =
    reportData;

  return (
    <div className="report-wrapper">
      <div className="report-container">
        {/* 상단 타이틀 영역 - 성공률 API에서 받아온 값 맵핑 */}
        <div className="top-header">
          <div className="title-left">
            <h1 className="main-title">
              {successInfo?.title || "실험 레포트"}
            </h1>
            <p className="date-text">
              {formatDate(successInfo?.startDate)} ~{" "}
              {formatDate(successInfo?.endDate)}
            </p>
          </div>
          <div className="title-right">
            <div className="check-icon">
              <IconCheck />
            </div>
            <div className="score-text">{successInfo?.successRate ?? 0}%</div>
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
              <span className="toggle-value">{attendanceRate}%</span>
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
                  {/* 그래프용 지표별 변화 데이터 조회 API는 차트 라이브러리 연동 혹은 그래프 상세 서브뷰 진입 시 별도 활용 가능합니다. */}
                  <span
                    className="graph-link"
                    onClick={() => navigate(`/graph/${experimentId}`)}
                  >
                    그래프로 확인하기
                  </span>
                </div>
                <div className="metrics-list">
                  {metricsList.map((metric, idx) => (
                    <MetricRow
                      key={idx}
                      label={metric.name}
                      from={metric.previousValue}
                      to={metric.currentValue}
                      diff={`${metric.delta}${metric.direction === "UP" ? "↑" : "↓"}`}
                      active={metric.delta > 0}
                    />
                  ))}
                  {metricsList.length === 0 && (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "15px",
                        color: "#999",
                      }}
                    >
                      조회된 지표가 없습니다.
                    </div>
                  )}
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
                {topMetric ? (
                  <>
                    <div className="biggest-change-label">
                      {topMetric.recordItemKey}
                    </div>
                    <div className="biggest-change-cards">
                      <div className="card gray-card">
                        <span className="card-num">{topMetric.preValue}</span>
                        <span className="card-desc">실험 전</span>
                      </div>
                      <span className="card-arrow">→</span>
                      <div className="card purple-card">
                        <span className="card-num">
                          {topMetric.valueAtMaxChange}
                        </span>
                        <span className="card-desc">
                          {formatDate(topMetric.recordDate)?.slice(3)}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "15px",
                      color: "#999",
                    }}
                  >
                    데이터가 충분하지 않습니다.
                  </div>
                )}
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
                <div
                  className="ai-box"
                  style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.5",
                    fontSize: "14px",
                  }}
                >
                  {aiComment}
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className="button-container"
          style={{ marginTop: "30px", padding: "0 20px 20px" }}
        ></div>
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
