import React from 'react';
import './Prerecorded.css';

const Prerecorded = () => {
    return (
        <div className="prerecorded-container">
            <main className="prerecorded-card">
                <div className="prerecorded-card-content">
                    
                    <div className="prerecorded-title-group">
                        <h2>기록이 완료되었어요!</h2>
                        <p>내일부터 매일매일 상태를 기록할 수 있어요</p>
                    </div>
                    <button className="back-home-button">홈으로</button>
                </div>
            </main>
        </div> /* 배포하기 위한 작은 수정.. */
    )
}