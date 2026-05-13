import React from 'react';
import './CreatePrerecordAlert.css';
import XIcon from '../../assets/XIcon.png';
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
                        <img src={XIcon} className="x-icon" alt="엑스 아이콘" />
                        <div className="prerecord-alert-title">실험 전 상태를 기록하지 않으면<br />실험이 시작하지 않아요</div>
                        <div className="home-record-info">나중에 홈화면에서 기록할 수 있어요</div>
                    </div>
                    <button className="back-home-button">확인</button>
                </div>
            </main>
        </div>
    );
};
export default Created;