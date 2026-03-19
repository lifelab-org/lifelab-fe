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
      items.filter((_,i) => i !== index);
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

                        <span className="date-minus-icon"><Minus stroke-width={1} /></span>

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
                          <input className="chip-input" type="text" placeholder="항목추가" />
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












/*
const CreateExperiment = () => {
  // 기록 항목 리스트 상태 관리
  const [items, setItems] = useState(['피로도', '집중력', '기분', '소화상태', '수면만족도']);

  return (
    <div className="experiment-container">
      {/* 상단 헤더 }
      <header className="experiment-header">
        <ChevronLeft className="header-icon" />
        <h2 className="header-title">실험 생성</h2>
      </header>

      <main className="experiment-form">
        {/* 실험 제목 }
        <div className="input-section">
          <label>실험 제목</label>
          <input type="text" placeholder="제목을 입력하세요" defaultValue="카페인 줄이기" />
        </div>

        {/* 실험 기간 }
        <div className="input-section">
          <label>실험 기간</label>
          <div className="date-picker-group">
            <div className="date-box"><CalendarIcon size={16} /> 26/01/26</div>
            <span className="date-separator">-</span>
            <div className="date-box"><CalendarIcon size={16} /> 26/01/26</div>
          </div>
        </div>

        {/* 실험 규칙 }
        <div className="input-section">
          <label>실험 규칙</label>
          <input type="text" placeholder="제목을 입력하세요" defaultValue="하루 커피 1잔 이하" />
        </div>

        {/* 기록 항목 (칩 형태) }
        <div className="input-section">
          <label>기록 항목</label>
          <div className="chip-list">
            {items.map((item, index) => (
              <div key={index} className="item-chip">
                <span className="minus-icon">—</span> {item}
              </div>
            ))}
            <div className="item-chip add-btn">
              <Plus size={14} /> 항목추가
            </div>
          </div>
        </div>
      </main>

      {/* 생성 버튼 }
      <footer className="footer-action">
        <button className="submit-button active">생성하기</button>
      </footer>

      {/* 하단 네비게이션 바 }
      <nav className="bottom-navigation">
        <div className="nav-tab"><Home size={20} /><span>홈</span></div>
        <div className="nav-tab active"><Calendar size={20} /><span>캘린더</span></div>
        <div className="nav-tab"><Folder size={20} /><span>아카이브</span></div>
      </nav>
    </div>
  );
};

export default CreateExperiment;
*/