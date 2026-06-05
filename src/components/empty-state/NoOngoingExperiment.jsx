import "./NoOngoingExperiment.css";
import logo from "../../assets/lifelab_logo.png";
import { useNavigate } from "react-router-dom";

function NoOngoingExperiment() {
  const navigate = useNavigate();

  const handleCreateExperimentClick = () => {
    navigate("/createExperiment");
  };

  return (
    <div className="Modalbox">
      <img src={logo} className="modal-logo" alt="logo" />
      <div className="experiment-state">지금 진행 중인 실험이 없어요.</div>
      <div className="experiment-ready">작은 실험부터 시작해 볼까요?</div>
      <button
        type="button"
        className="making-experiments"
        onClick={handleCreateExperimentClick} // 👈 4. 함수 연결
      >
        실험 생성
      </button>
    </div>
  );
}

export default NoOngoingExperiment;
