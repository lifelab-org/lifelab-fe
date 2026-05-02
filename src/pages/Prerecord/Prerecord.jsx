import React from 'react';
import './Prerecord.css';
import { ArrowLeft } from 'lucide-react';

const Prerecord = () => {

    return (
        <div className="prerecord-container">
            {/*헤더*/}
            <header className="prerecord-header">
                <ArrowLeft className="back-icon" />
                <h2 className="header-title">실험 전 상태</h2>
                <p className="header-describe">
                    실험 시작 전에 한 번만 기록해요<br/>
                    이후에는 자동으로 기준값으로 사용돼요
                </p>
            </header>

            <main>
                {/* 첫 번째 지표 */}
                <div className="metrics">
                    <div className="first-metric">피로도</div>
                    <div className="condition-scale"></div>
                </div>
            </main>
        </div>
    )
}