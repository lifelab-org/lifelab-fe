import "./NoOngoingExperiment.css";
import logo from "../../assets/lifelab_logo.png";

function NoOngoingExperiment() {
  return (
    <div className="Modalbox">
      <img src={logo} className="lifelab-logo" />
      <div className="experiment-state">지금 진행 중인 실험이 없어요.</div>
      <div className="experiment-ready">작은 실험부터 시작해 볼까요?</div>
      <button className="making-experiments">실험 생성</button>
    </div>
  );
}

export default NoOngoingExperiment;
