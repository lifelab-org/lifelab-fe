import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✨ Link 대신 navigate로 API 호출 후 이동 처리
import Header from "../../components/header/Header";
import NoOngoingExperiment from "../../components/empty-state/NoOngoingExperiment";
import "./Home.css";
import Api from "../../api/Api";

export default function Home() {
  const navigate = useNavigate();
  const [experiments, setExperiments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateExperimentClick = () => {
    navigate("/createExperiment");
  };

  // ✨ 카드 클릭 시 결과 확인 API를 먼저 거치고 이동하는 핸들러
  const handleCardClick = async (exp) => {
    // 1. D-Day가 남아있는 경우 바로 상세 페이지로 이동
    if (exp.dDay > 0) {
      navigate(`/experimentdetail/${exp.experimentId}`);
      return;
    }

    // 2. D-Day가 종료된 경우 (dDay <= 0) 결과 확인 API 호출
    try {
      // 명세서에 따른 POST 요청 실행
      await Api.post(`/experiments/${exp.experimentId}/result-check`);
      console.log(`${exp.experimentId}번 실험 결과 확인 완료`);

      // 성공 시 리포트 페이지로 이동
      navigate(`/experimentreport/${exp.experimentId}`);
    } catch (error) {
      console.error("결과 확인 API 에러:", error);

      // 인증 실패 시 온보딩으로
      if (error.response && error.response.status === 401) {
        navigate("/onboarding", { replace: true });
        return;
      }

      // 이미 처리되었거나 다른 에러가 나도 일단 리포트로 안전하게 이동 시키기
      navigate(`/experimentreport/${exp.experimentId}`);
    }
  };

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        await Api.get("/auth/me");
        console.log("로그인 상태 확인 완료");

        const res = await Api.get("/experiments/ongoing");
        const successData = res.data?.success;

        let rawExperiments = [];
        if (successData && Array.isArray(successData.experiments)) {
          rawExperiments = successData.experiments;
        } else if (Array.isArray(successData)) {
          rawExperiments = successData;
        }

        // 오름차순 정렬
        const sortedExperiments = [...rawExperiments].sort(
          (a, b) => a.dDay - b.dDay,
        );
        setExperiments(sortedExperiments);

        setIsLoading(false);
      } catch (error) {
        console.error("에러 발생:", error);

        if (error.response && error.response.status === 401) {
          navigate("/onboarding", { replace: true });
          return;
        }

        setErrorMessage(error.message);
        setIsLoading(false);
      }
    };

    fetchExperiments();
  }, [navigate]);

  if (isLoading)
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>로딩중...</div>
    );
  if (errorMessage)
    return (
      <div style={{ color: "red", padding: "20px" }}>
        에러 발생: {errorMessage}
      </div>
    );

  return (
    <div className="home-container">
      <Header />

      <main className="home-main">
        {experiments.length === 0 ? (
          <div className="empty-wrapper">
            <NoOngoingExperiment />
          </div>
        ) : (
          <div className="experiment-list">
            {experiments.map((exp) => (
              // ✨ Link 태그를 div(혹은 button)로 바꾸고 onClick 핸들러로 제어합니다.
              <div
                key={exp.experimentId}
                onClick={() => handleCardClick(exp)}
                className={`experiment-card ${exp.dDay === 0 ? "highlight" : ""}`}
                style={{ cursor: "pointer" }} // 클릭 가능하게 마우스 커서 변경
              >
                <div className="card-info">
                  <h3 className="experiment-title">
                    <div
                      className="color-circle"
                      style={{ backgroundColor: exp.color || "#A294F9" }}
                    />
                    {exp.title}
                  </h3>

                  <p className="experiment-subtitle">
                    {exp.dDay <= 0
                      ? "실험이 완료되었어요! 결과를 확인해보세요"
                      : exp.subtitle}
                  </p>
                </div>

                <span className="experiment-dday">
                  {exp.dDay === 0
                    ? "D-Day"
                    : exp.dDay < 0
                      ? `D+${Math.abs(exp.dDay)}`
                      : `D-${exp.dDay}`}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 실험 데이터가 1개 이상일 때만 실험 생성 버튼 활성화 */}
        {experiments.length > 0 && (
          <div className="button-container">
            <button
              className="create-experiment-btn"
              onClick={handleCreateExperimentClick}
            >
              실험 생성
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
