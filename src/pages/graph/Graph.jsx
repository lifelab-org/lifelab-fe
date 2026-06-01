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

        // 1. 상단 타이틀 및 성공률 표기를 위한 성공 데이터 호출
        const successRes = await Api.get(
          `/experiments/${experimentId}/success`,
        );
        const experimentInfo =
          successRes.data?.success?.experiments?.find(
            (exp) => String(exp.experimentId) === String(experimentId),
          ) || successRes.data?.success?.experiments?.[0];

        setHeaderInfo(experimentInfo || null);

        // 2. 그래프 시각화용 지표 목록 데이터 호출 후 차트 포맷으로 변환
        const metricsRes = await Api.get(
          `/experiments/${experimentId}/archive/metrics`,
        );
        const originMetrics = metricsRes.data?.success?.metrics || [];

        // Recharts 맞춤형 차트 데이터 배열 가공 (ex: [{ name: "지표명", value: 현재값 }])
        const formattedData = originMetrics.map((metric) => ({
          name: metric.name,
          "이전 값": metric.previousValue,
          "현재 값": metric.currentValue,
          변화량: metric.delta,
        }));

        setGraphData(formattedData);
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

  // 날짜 포맷팅용 함수 (2025-12-20 -> 25.12.20)
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

  return (
    <div className="report-wrapper">
      <div className="report-container">
        {/* 뒤로가기 버튼 영역 */}
        <div className="back-button-row" onClick={() => navigate(-1)}>
          <IconBack />
        </div>

        {/* 상단 타이틀 영역 (지정 형식을 고수하여 컴포넌트 일치) */}
        <div className="top-header">
          <div className="title-left">
            <h1 className="main-title">{headerInfo?.title || "밀가루 끊기"}</h1>
            <p className="date-text">
              {formatDate(headerInfo?.startDate) || "25.12.20"} ~{" "}
              {formatDate(headerInfo?.endDate) || "25.12.27"}
            </p>
          </div>
          <div className="title-right">
            <div className="check-icon-wrapper">
              <IconCheck />
            </div>
            <div className="score-text">{headerInfo?.successRate ?? 89}%</div>
          </div>
        </div>

        <div className="sub-title">실험 레포트</div>
        <hr className="divider-line" />

        {/* 피그마 시안의 연보라 대형 차트 영역 박스 */}
        <div className="chart-large-box">
          {graphData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={graphData}
                margin={{ top: 25, right: 20, left: -20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0eefc" />
                <XAxis
                  dataKey="name"
                  stroke="#a0a0a0"
                  tick={{ fontSize: 11 }}
                />
                <YAxis stroke="#a0a0a0" tick={{ fontSize: 11 }} />
                <Tooltip />
                {/* 시안 브랜딩 컬러에 최적화된 연보라 굵은 꺾은선 배치 */}
                <Line
                  type="monotone"
                  dataKey="현재 값"
                  stroke="#9d8df1"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
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
