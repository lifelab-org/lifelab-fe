import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../../api/Api";
import "./ExperimentReport.css";
import vectorImage from "../../assets/Vector.png";

import okImage from "../../assets/ok.png"; // 완료 시 체크 이미지
import xImage from "../../assets/X.png"; // 실패 시 X 이미지

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

const ExperimentReport = () => {
  const { experimentId } = useParams();
  const navigate = useNavigate();

  const [reportData, setReportData] = useState({
    successInfo: null,
    attendanceRate: 0,
    metricsList: [],
    topMetric: null,
    aiComment: "",
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

        // 특정 API가 에러를 뱉어도 전체가 깨지지 않도록 개별 .catch() 처리 (데이터 보장)
        const [
          successRes,
          attendanceRes,
          metricsRes,
          topMetricRes,
          commentRes,
        ] = await Promise.all([
          Api.get(`/experiments/${experimentId}/success`).catch(() => null),
          Api.get(`/experiments/${experimentId}/attendance`).catch(() => null),
          Api.get(`/experiments/${experimentId}/archive/metrics`).catch(
            () => null,
          ),
          Api.get(`/experiments/${experimentId}/archive/metrics/top`).catch(
            () => null,
          ),
          Api.get(`/experiments/${experimentId}/comment`).catch(() => null),
        ]);

        const experimentsArray = successRes?.data?.success?.experiments || [];
        const experimentInfo =
          experimentsArray.find(
            (exp) => String(exp.experimentId) === String(experimentId),
          ) ||
          experimentsArray[0] ||
          null;

        setReportData({
          successInfo: experimentInfo,
          attendanceRate: attendanceRes?.data?.success?.attendanceRate ?? 0,
          metricsList: metricsRes?.data?.success?.metrics || [],
          topMetric: topMetricRes?.data?.success || null,
          aiComment:
            commentRes?.data?.success?.comment || "분석된 코멘트가 없습니다.",
        });
      } catch (error) {
        console.error("Critical Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (experimentId) {
      fetchReportData();
    }
  }, [experimentId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return dateStr.replace(/^\d{2}(\d{2})-(\d{2})-(\d{2})$/, "$1.$2.$3");
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const { successInfo, attendanceRate, metricsList, topMetric, aiComment } =
    reportData;

  if (isLoading) {
    return (
      <div style={{ padding: "50px", textAlign: "center", color: "#666" }}>
        AI 리포트 분석 및 로딩 중...
      </div>
    );
  }

  // successInfo가 존재하고, isSuccess가 명확히 false일 때만 실패(X) 처리
  const isExperimentSuccess = successInfo?.isSuccess !== false;

  return (
    <div className="report-wrapper">
      <div className="report-container">
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
            {/* ✨ SVG 대신 이미지 태그 삽입 */}
            <div className="check-icon">
              {isExperimentSuccess ? (
                <img src={okImage} alt="완료" className="status-img" />
              ) : (
                <img src={xImage} alt="실패" className="status-img" />
              )}
            </div>
            <div className="score-text">{successInfo?.successRate ?? 0}%</div>
          </div>
        </div>

        <div className="sub-title">실험 레포트</div>
        <hr className="divider-line" />

        <div className="toggle-list">
          {/* 1. 나의 실험 출석률 */}
          <div className="toggle-item">
            <div
              className="toggle-header"
              onClick={() => toggleSection("attendance")}
            >
              <div className="toggle-header-left">
                <img src={vectorImage} alt="화살표" className="vector-icon" />
                <span className="toggle-text">나의 실험 출석률</span>
              </div>
              {openSections.attendance && (
                <span className="toggle-value">{attendanceRate}%</span>
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
                <img src={vectorImage} alt="화살표" className="vector-icon" />
                <span className="toggle-text">지표 별 변화량</span>
              </div>
              {openSections.metrics && (
                <span
                  className="graph-link"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/graph/${experimentId}`);
                  }}
                >
                  그래프로 확인하기
                </span>
              )}
            </div>
            {openSections.metrics && (
              <div className="toggle-content">
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
                        padding: "15px",
                        color: "#999",
                        fontSize: "14px",
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
                <img src={vectorImage} alt="화살표" className="vector-icon" />
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
                      <div className="card-column">
                        <div className="card-box">{topMetric.preValue}</div>
                        <span className="card-desc">실험 전</span>
                      </div>
                      <span className="card-arrow">→</span>
                      <div className="card-column">
                        <div className="card-box purple-box">
                          {topMetric.valueAtMaxChange}
                        </div>
                        <span className="card-desc">
                          {formatDate(topMetric.recordDate)?.slice(3)}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    style={{ padding: "15px", color: "#999", fontSize: "14px" }}
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
                <img src={vectorImage} alt="화살표" className="vector-icon" />
                <span className="toggle-text">AI 코멘트</span>
              </div>
            </div>
            {openSections.ai && (
              <div className="toggle-content">
                <div className="ai-box">{aiComment}</div>
              </div>
            )}
          </div>
        </div>

        <div
          className="button-container"
          style={{ marginTop: "40px", padding: "0 20px 20px" }}
        ></div>
      </div>
    </div>
  );
};

export default ExperimentReport;
