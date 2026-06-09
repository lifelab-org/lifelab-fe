import React from 'react';
import './Prerecorded.css';
import { useNavigate } from 'react-router-dom';

const Prerecorded = () => {
    const navigate = useNavigate();
    const handleHomeClick = () => {
        navigate('/');
    }
    return (
        <div className="prerecorded-container">
            <main className="prerecorded-card-content">                  
                <h2>기록이 완료되었어요!</h2>
                <p>내일부터 매일매일 상태를 기록할 수 있어요</p>
            </main>
            <footer>
                <button className="back-home-button" onClick={handleHomeClick}>홈으로</button>
            </footer>
        </div>
    )
}

export default Prerecorded;