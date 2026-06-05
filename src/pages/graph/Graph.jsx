import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Api from "../../api/Api";
import "./Graph.css";
import okImage from "../../assets/ok.png";
import xImage from "../../assets/X.png";

const IconBack = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#000"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ cursor: "pointer" }}
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const Graph = () => {
  const { experimentId } = useParams();
  const navigate = useNavigate();

  const [headerInfo, setHeaderInfo] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGraphPageData = async () => {
      try {
        setIsLoading(true);

        const [successRes, metricsGraphRes] = await Promise.all([
          Api.get(`/experiments/${experimentId}/success`).catch(() => null),
          Api.get(`/experiments/${experimentId}/archive/metrics/graph`).catch(
            () => null,
          ),
        ]);

        const experimentsArray = successRes?.data?.success?.experiments || [];
        const experimentInfo =
          experimentsArray.find(
            (exp) => String(exp.experimentId) === String(experimentId),
          ) ||
          experimentsArray[0] ||
          null;

        setHeaderInfo(experimentInfo);

        const originMetrics = metricsGraphRes?.data?.success?.metrics || [];
        setGraphData(originMetrics);
      } catch (error) {
        console.error("그래프 페이지 데이터를 가져오는 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (experimentId) {
      fetchGraphPageData();
    }
  }, [experimentId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return dateStr.replace(/^\d{2}(\d{2})-(\d{2})-(\d{2})$/, "$1.$2.$3");
  };

  if (isLoading) {
    return (
      <div style={{ padding: "50px", textAlign: "center", color: "#666" }}>
        지표 그래프 불러오는 중...
      </div>
    );
  }

  const isExperimentSuccess = headerInfo?.isSuccess !== false;

  return (
    <div className="report-wrapper">
      <div className="report-container">
        {/* 뒤로가기 버튼 영역 */}
        <div className="back-button-row" onClick={() => navigate(-1)}>
          <IconBack />
        </div>

        {/* 상단 타이틀 영역 */}
        <div className="top-header">
          <div className="title-left">
            <h1 className="main-title">{headerInfo?.title || "실험 레포트"}</h1>
            <p className="date-text">
              {formatDate(headerInfo?.startDate)} ~{" "}
              {formatDate(headerInfo?.endDate)}
            </p>
          </div>
          <div className="title-right">
            <div className="check-icon">
              {isExperimentSuccess ? (
                <img src={okImage} alt="완료" className="status-img" />
              ) : (
                <img src={xImage} alt="실패" className="status-img" />
              )}
            </div>
            <div className="score-text">{headerInfo?.successRate ?? 0}%</div>
          </div>
        </div>

        <div className="sub-title">실험 레포트</div>
        <hr className="divider-line" />

        {/* 각 지표가 날짜별 타임라인 흐름에 맞춰 독립된 꺾은선으로 렌더링되는 영역 */}
        <div
          className="chart-large-box"
          style={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          {graphData.length > 0 ? (
            graphData.map((metric, idx) => (
              <div
                key={idx}
                className="metric-chart-item"
                style={{ width: "100%" }}
              >
                {/* 지표명 (피로도, 소화 상태 등) */}
                <div
                  className="metric-chart-title"
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    color: "#333",
                  }}
                >
                  {metric.name}
                </div>

                {/* 날짜별로 쪼개지는 개별 차트 컨테이너 */}
                <div style={{ width: "100%", height: "140px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={metric.points || []}
                      /* 🛠️ 좌측 마진을 확보(-35 -> 10)하여 Y축 수치와 첫 번째 점이 깎이지 않도록 패딩 보완 */
                      margin={{ top: 10, right: 15, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0eefc" />
                      <XAxis
                        dataKey="date"
                        stroke="#a0a0a0"
                        /* 🛠️ padding 옵션을 추가하여 양 끝단(6.5, 6.17)의 둥근 마커가 컨테이너 밖으로 잘리지 않게 방지 */
                        padding={{ left: 15, right: 15 }}
                        tickFormatter={(date) => {
                          if (!date) return "";

                          const parts = date.split("-");
                          return parts.length >= 3
                            ? `${parseInt(parts[1], 10)}.${parseInt(parts[2], 10)}`
                            : date;
                        }}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis
                        stroke="#a0a0a0"
                        tick={{ fontSize: 10 }}
                        domain={["auto", "auto"]}
                      />

                      <Tooltip
                        formatter={(value) => [`${value}점`, "기록"]}
                        labelFormatter={(date) => `날짜: ${date}`}
                      />

                      <Line
                        type="monotone"
                        dataKey="value"
                        name="점수"
                        stroke="#9d8df1"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-chart-text">
              시각화할 변화량 지표가 존재하지 않습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Graph;
