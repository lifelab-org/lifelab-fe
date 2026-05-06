import "./DeleteCompleteModal.css";
import Check from "../../assets/check.png";

function DeleteCompleteModal({ isOpen, onHome }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="complete-box">
        <img src={Check} className="check-icon" alt="완료 아이콘" />
        <div className="complete-title">삭제 완료!</div>
        <button className="home-btn" onClick={onHome}>
          홈으로
        </button>
      </div>
    </div>
  );
}

export default DeleteCompleteModal;
