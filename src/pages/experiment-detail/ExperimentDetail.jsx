import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ExperimentDetail.css";
import Delete from "../../assets/delete.png";
import ArrowLeft from "../../assets/arrow-left.png";
import DeleteModal from "../../components/delete/DeleteModal";
import DeleteCompleteModal from "../../components/deletecompletemodal/DeleteCompleteModal";

function ExperimentDetail() {
  const navigate = useNavigate();

  // 테스트용 데이터
  const dummyData = [
    { id: 1, content: "2026년 1월 1일~1월 30일(총 30일)" },
    { id: 2, content: "D-8" },
    { id: 3, content: "오후 2시 이후로 카페인 섭취하지 않기" },
    { id: 4, content: "피로도, 집중력, 기분, 수면 만족도" },
  ];

  const [isClicked, setIsClicked] = useState(false);

  // 모달 상태 관리
  const [isOpen, setIsOpen] = useState(false); // 삭제 확인 모달
  const [isCompleteOpen, setIsCompleteOpen] = useState(false); // 삭제 완료 모달

  // 삭제 확인 창에서 '삭제' 버튼 눌렀을 때
  const handleDelete = () => {
    setIsOpen(false); // 확인 모달 닫기
    setIsCompleteOpen(true); // 완료 모달 열기
  };

  // 완료 창에서 '홈으로' 버튼 눌렀을 때
  const goHome = () => {
    setIsCompleteOpen(false);
    navigate("/"); // 홈으로 이동
  };

  return (
    <div className="detail-container">
      {/* 상단 헤더 영역 */}
      <img
        src={ArrowLeft}
        className="arrowleft-icon"
        alt="뒤로가기 아이콘"
        onClick={() => navigate(-1)}
      />

      <div className="experimentdetail-header">실험 이름</div>

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
          <div className="value">{dummyData[0].content}</div>
        </div>

        <hr className="divider" />

        <div className="remainingdate">
          <div className="title">남은기간</div>
          <div className="value">{dummyData[1].content}</div>
        </div>

        <hr className="divider" />

        <div className="experimentrule">
          <div className="title">실험규칙</div>
          <div className="value">{dummyData[2].content}</div>
        </div>

        <hr className="divider" />

        <div className="recordFields">
          <div className="title">기록항목</div>
          <div className="value">{dummyData[3].content}</div>
        </div>
      </div>

      <div className="ai-review">AI 한 줄 요약</div>

      {/* 오늘의 기록 버튼 */}
      <div
        className={`today-record-start ${isClicked ? "clicked" : ""}`}
        onClick={() => setIsClicked(!isClicked)}
      >
        오늘의 기록 시작
      </div>

      {/* --- 모달 영역 --- */}

      {/* 1. 삭제 여부 묻는 모달 */}
      <DeleteModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onDelete={handleDelete}
      />

      {/* 2. 삭제 완료 알려주는 모달 */}
      <DeleteCompleteModal isOpen={isCompleteOpen} onHome={goHome} />
    </div>
  );
}

export default ExperimentDetail;
