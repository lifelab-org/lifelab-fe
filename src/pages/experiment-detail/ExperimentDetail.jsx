import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ExperimentDetail.css";
import Delete from "../../assets/delete.png";
import ArrowLeft from "../../assets/arrow-left.png";
import DeleteModal from "../../components/delete/DeleteModal";
import DeleteCompleteModal from "../../components/deletecompletemodal/DeleteCompleteModal";
import Api from "../../api/Api";

function ExperimentDetail() {
  const navigate = useNavigate();
  const { experimentId } = useParams();

  const [experiment, setExperiment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isClicked, setIsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false); // 삭제 완료 모달

  const handleStart = () => {
    navigate("/record", { state: { experimentId } });
  };

  useEffect(() => {
    const fetchDetail = async () => {
      // 1. 실험 상세 데이터 조회 (독립적인 try-catch)
      try {
        const res = await Api.get(`/experiments/${experimentId}`);

        if (res.data?.success) {
          setExperiment(res.data.success);
        }
      } catch (error) {
        console.error("상세 데이터 조회 실패:", error);
      }

      // ==========================================
      // 2. [수정] AI 한줄 요약 조회 API 연결 (독립 실행)
      // ==========================================
      try {
        const aiRes = await Api.get(
          `/experiments/${experimentId}/daily-summary`,
        );
        if (aiRes.data?.success?.summary) {
          setExperiment((prev) =>
            prev
              ? { ...prev, aiSummary: aiRes.data.success.summary }
              : { aiSummary: aiRes.data.success.summary },
          );
        }
      } catch (aiError) {
        console.error("AI 한줄 요약 조회 실패:", aiError);
      } finally {
        // 두 요청 시도가 모두 끝난 후 로딩 상태 해제
        setIsLoading(false);
      }
      // ==========================================
    };

    if (experimentId) {
      fetchDetail();
    }
  }, [experimentId]);

  const handleDelete = async () => {
    try {
      await Api.delete(`/experiments/${experimentId}`); // 삭제 요청
      setIsOpen(false); // 확인 모달 닫기
      setIsCompleteOpen(true); // 완료 모달 열기
    } catch (error) {
      console.error("실험 삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const goHome = () => {
    setIsCompleteOpen(false);
    navigate("/");
  };

  if (isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>로딩중...</div>
    );
  }

  return (
    <div className="detail-container">
      {/* 상단 헤더 영역 */}
      <img
        src={ArrowLeft}
        className="arrowleft-icon"
        alt="뒤로가기 아이콘"
        onClick={() => navigate(-1)}
      />

      <div className="experimentdetail-header">
        {experiment?.title || "실험 정보"}
      </div>

      <img
        src={Delete}
        className="delete-icon"
        alt="삭제 아이콘"
        onClick={() => setIsOpen(true)}
      />

      {/* 실험 정보 박스 */}
      <div className="experiment-box">
        <div className="experimentdate">
          <div className="title">실험기간</div>

          <div className="value">
            {experiment
              ? `${experiment.startDate} ~ ${experiment.endDate}`
              : "-"}
          </div>
        </div>

        <hr className="divider" />

        <div className="remainingdate">
          <div className="title">남은기간</div>

          <div className="value">
            {experiment?.dDay === 0 ? "D-Day" : `D-${experiment?.dDay || 0}`}
          </div>
        </div>

        <hr className="divider" />

        <div className="experimentrule">
          <div className="title">실험규칙</div>

          <div className="value">
            {experiment?.rule || "지정된 규칙이 없습니다."}
          </div>
        </div>

        <hr className="divider" />

        <div className="recordFields">
          <div className="title">기록항목</div>

          <div className="value">
            {experiment?.recordItems && experiment.recordItems.length > 0
              ? experiment.recordItems.join(", ")
              : "지정된 항목이 없습니다."}
          </div>
        </div>
      </div>

      <div className="ai-review">
        {experiment?.aiSummary || "AI 한 줄 요약"}
      </div>

      <div
        className={`today-record-start ${isClicked ? "clicked" : ""}`}
        onClick={handleStart}
      >
        오늘의 기록 시작
      </div>

      <DeleteModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onDelete={handleDelete}
      />

      <DeleteCompleteModal isOpen={isCompleteOpen} onHome={goHome} />
    </div>
  );
}

export default ExperimentDetail;
