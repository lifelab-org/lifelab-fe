import React, { useState } from 'react';
import './CreateExperiment.css';
import { Calendar, Minus, Plus, ArrowLeft } from 'lucide-react';
import DatePicker from 'react-datepicker'; // 달력 라이브러리
import "react-datepicker/dist/react-datepicker.css"; // 달력 기본 스타일; css에서 수정해서 덮어씌울 것
import BottomNav from '../../components/BottomNav';

const CreateExperiment = () => {
    const [startDate, updateStartDate] = useState(null);
    const [endDate, updateEndDate] = useState(null);
    const [items, setItems] = useState(['피로도', '집중력', '기분', '소화상태', '수면만족도']);
    const [title, setTitle] = useState('');
    const [rule, setRule] = useState('');
    const isReady = title.trim().length && rule.trim().length > 0 && startDate && endDate && items.length > 0;
    const addItem = () => {
      setItems([...items, '']);
    }
    const removeItem = (index) => {
      const newItems = items.filter((_,i) => i !== index);
      setItems(newItems);
    }
    const updateItem = (index, newValue) => {
      const newItems = [...items];
      newItems[index] = newValue;
      setItems(newItems);
    }

    return (
        <div className="experiment-container">
            {/* 헤더 */}
            <header className="experiment-header">
                <ArrowLeft className="back-icon" />
                <h2 className="header-title">실험 생성</h2>
            </header>

            <main>
                {/* 실험 제목 */}
                <div className="input-section">
                    <h2 className="experiment-meta">실험 제목</h2>
                    <input type="text" placeholder="제목을 입력하세요"
                    value={title} onChange={(event) => setTitle(event.target.value)}></input>              
                </div>

                {/* 실험 기간 */}
                <div className="input-section">
                    <h2 className="experiment-meta">실험 기간</h2>
                    <div className="experiment-duration">
                        <div className="date-box">
                            <div className="calendar-icon"><Calendar /></div>
                            <DatePicker
                              selected={startDate}
                              onChange={(date) => updateStartDate(date)}
                              dateFormat="yy/MM/dd"
                            />
                        </div>

                        <span className="date-minus-icon"><Minus strokeWidth={1} /></span>

                        <div className="date-box">
                            <div className="calendar-icon"><Calendar /></div>
                            <DatePicker
                              selected={endDate}
                              onChange={(date) => updateEndDate(date)}
                              dateFormat="yy/MM/dd"
                            />
                        </div>
                    </div>
                </div>

                {/* 실험 규칙 */}
                <div className="input-section">
                    <h2 className="experiment-meta">실험 규칙</h2>
                    <input type="text" placeholder="규칙을 입력해주세요"
                    value={rule} onChange={(event) => setRule(event.target.value)}></input> 
                </div>
                
                {/* 기록 항목 */}
                <div className="input-section">
                    <h2 className="experiment-meta">기록 항목</h2>
                    <div className="chip-list">
                        {items.map(
                          (item, index) => (
                          <div className="item-chip" key={index}>
                              <button className="chip-minus-icon" onClick={() => removeItem(index)}><Minus /></button>
                              <input className="chip-input" type="text" value={item} onChange={(e) => updateItem(index, e.target.value)} placeholder="항목입력"/>
                          </div>
                        ))}
                        <div className="add-chip">
                          <button className="chip-plus-icon" onClick={addItem}><Plus /></button>
                          <span classname="add-placeholder">항목추가</span>
                        </div>
                    </div>
                </div>
            </main>

            <footer>
                <button className={`create-button ${ isReady ? 'active' : ''}`} disabled={!isReady}>
                  생성하기</button>
            </footer>

            {/* 하단 네비게이션바 */}
            <nav className="bottom-nav">
              <BottomNav />
            </nav>
        </div>
    );
};
export default CreateExperiment;

