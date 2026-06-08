import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  const handleCardClick = async (exp) => {
    // ==========================================
    // [🔥 최우선 순위 수정] 완료된 실험 분기
    // dDay가 음수(< 0)여서 화면에 D+로 표시되는 카드라면,
    // 사전 기록 여부와 상관없이 무조건 1등으로 리포트 처리 로직을 태웁니다!
    // ==========================================
    if (exp.dDay < 0) {
      try {
        await Api.post(`/experiments/${exp.experimentId}/result-check`);
        console.log(`${exp.experimentId}번 실험 결과 확인 완료`);

        // 클릭해서 완료 처리된 카드는 화면에서 없앰
        setExperiments((prev) =>
          prev.filter((item) => item.experimentId !== exp.experimentId),
        );

        // 🎯 튕기지 않고 정상적으로 리포트 페이지로 정상 이동!!
        navigate(`/experimentreport/${exp.experimentId}`);
      } catch (error) {
        console.error("결과 확인 API 에러:", error);

        if (error.response && error.response.status === 401) {
          navigate("/onboarding", { replace: true });
          return;
        }

        // 이미 처리되었거나 에러가 나도 리포트로 안전하게 이동시키고 카드 제외
        setExperiments((prev) =>
          prev.filter((item) => item.experimentId !== exp.experimentId),
        );
        navigate(`/experimentreport/${exp.experimentId}`);
      }
      return; // 완료된 실험은 이 단계에서 라우팅이 끝나므로 완전히 리턴 종료!
    }

    // ==========================================
    // 여기서부터는 아직 기간이 남은 '진행 중인 실험(dDay >= 0)'들만 들어옵니다.
    // ==========================================

    // 2. 실험 전 상태가 기록되지 않은 실험이면 prerecord 페이지로 이동
    if (!exp.preStateRecorded) {
      navigate(`/prerecord/${exp.experimentId}`);
      return;
    }

    // 3. dDay가 0 이상이면서 사전 기록도 끝난 실험 -> 상세 페이지로 이동
    navigate(`/experimentdetail/${exp.experimentId}`);
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

        // 백엔드 요청 반영: 날짜 지난 실험도 원천 차단하지 않고 다 가져옴
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
              <div
                key={exp.experimentId}
                onClick={() => handleCardClick(exp)}
                className={`experiment-card ${exp.dDay === 0 ? "highlight" : ""}`}
                style={{ cursor: "pointer" }}
              >
                <div className="card-info">
                  <h3 className="experiment-title">
                    <div
                      className="color-circle"
                      style={{ backgroundColor: exp.color || "#A294F9" }}
                    />
                    {exp.title}
                  </h3>

                  {/* dDay가 음수(완료)일 때만 완료 문구 노출 */}
                  <p className="experiment-subtitle">
                    {exp.dDay < 0
                      ? "실험이 완료되었어요! 결과를 확인해보세요"
                      : exp.subtitle}
                  </p>
                </div>

                {/* 디데이 표시 부호 수정 (-를 +로 변환) */}
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
