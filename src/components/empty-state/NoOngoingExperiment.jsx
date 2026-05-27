import "./NoOngoingExperiment.css";
import logo from "../../assets/lifelab_logo.png";
import Api from "../../api/Api";

function NoOngoingExperiment({ onCreated }) {
  const handleCreateExperiment = async () => {
    try {
      const response = await Api.post("/experiments", {
        title: "카페인 줄이기 실험",
        startDate: "2026-06-01",
        endDate: "2026-06-28",
        rule: "오후 2시 이후 카페인 금지",
        recordItems: [
          { name: "피로도" },
          { name: "집중력" },
          { name: "수면만족도" },
          { name: "카페 섭취 여부" },
        ],
      });

      if (response.status === 200 || response.status === 201) {
        if (onCreated) onCreated();
      }
    } catch (error) {
      console.error("실험 생성 실패:", error);
    }
  };

  return (
    <div className="Modalbox">
      <img src={logo} className="modal-logo" alt="logo" />
      <div className="experiment-state">지금 진행 중인 실험이 없어요.</div>
      <div className="experiment-ready">작은 실험부터 시작해 볼까요? 야르</div>
      <button
        type="button"
        className="making-experiments"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleCreateExperiment();
        }}
      >
        실험 생성
      </button>
    </div>
  );
}

export default NoOngoingExperiment;
