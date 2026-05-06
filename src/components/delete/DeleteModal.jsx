import "./DeleteModal.css";

function DeleteModal({ isOpen, onClose, onDelete }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="delete-box" onClick={(e) => e.stopPropagation()}>
        <div className="delete-title">이 실험을 삭제할까요?</div>
        <div className="delete-content">
          이 실험의 모든 기록이 함께 삭제돼요. <br />
          삭제 후에는 다시 복구할 수 없어요.
        </div>
        <div className="button-group">
          <button className="cancel-btn" onClick={onClose}>
            취소
          </button>
          <button className="delete-btn" onClick={onDelete}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
