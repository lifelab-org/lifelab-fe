import React from 'react';
import './Created.css';
import CheckIcon from '../../assets/check.png';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Created = () => {
    const navigate = useNavigate();  
    const location = useLocation();
    const experimentId = location.state?.experimentId;
    
    const handlePrerecordClick = () => {
        navigate(`/prerecord/${experimentId}`);
    }
    const handleAlertClick = () => {
        navigate(`/createPrerecordAlert`);
    }
    const goBackClick = () => {
        navigate(-1);
    }


    return (
        <div className="experiment-success">
            {/* 헤더 */}
            <header className="experiment-header">
                <ArrowLeft className="back-icon" onClick={goBackClick} />
                <h2 className="header-title">실험 생성</h2>
            </header>

            <main className="experiment-success-card">
                <div className="experiment-success-card-content">
                    
                    <div className="title-group">
                        <img src={CheckIcon} className="check-icon" alt="체크 아이콘" />
                        <div className="success-title">실험 생성 완료!</div>
                        <div className="status-record-link" onClick={handlePrerecordClick}>현재 상태 기록하러 가기</div>
                    </div>
                    <button className="back-home-button" onClick={handleAlertClick}>홈으로 돌아가기</button>
                </div>
            </main>
        </div>
    );
};
export default Created;