import React from 'react';
import './Created.css';
import CheckIcon from '../../assets/check.png';
import { ArrowLeft } from 'lucide-react';

const Created = () => {

    return (
        <div className="experiment-success">
            {/* 헤더 */}
            <header className="experiment-header">
                <ArrowLeft className="back-icon" />
                <h2 className="header-title">실험 생성</h2>
            </header>

            <main className="experiment-success-card">
                <div className="experiment-success-card-content">
                    
                    <div className="title-group">
                        <img src={CheckIcon} className="check-icon" alt="체크 아이콘" />
                        <div className="success-title">실험 생성 완료!</div>
                        <div className="status-record-link">현재 상태 기록하러 가기</div>
                    </div>
                    <button className="back-home-button">홈으로 돌아가기</button>
                </div>
            </main>
        </div>
    );
};
export default Created;