import "./DeleteCompleteModal.css";
import CheckGray from "../../assets/check_gray.png";

function DeleteCompleteModal({ isOpen, onHome }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="complete-box">
        <img src={CheckGray} className="check-icon" alt="완료 아이콘" />
        <div className="complete-title">삭제 완료!</div>
        <button className="home-btn" onClick={onHome}>
          홈으로
        </button>
      </div>
    </div>
  );
}

export default DeleteCompleteModal;
