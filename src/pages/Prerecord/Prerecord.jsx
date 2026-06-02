import React, { useState, useEffect } from 'react';
import './Prerecord.css';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/Api';

const Prerecord = () => {
     
    const { experimentId } = useParams(); 
    const navigate = useNavigate();

    const [metrics, setMetrics] = useState([]); // 서버에서 받아올 지표 목록
    const [records, setRecords] = useState({}); // 사용자가 선택한 상태 정도
    const [isLoading, setIsLoading] = useState(false);

    const goBackClick = () => {
        navigate(-1);
    }

    // 실험 생성 기록 항목 조회 api연결 (지표 목록 불러옴)
    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await api.get(`/experiments/${experimentId}/record-items`);
                const data = response.data;

                if (data.status === 200 && data.result === "Success") {
                    const fetchedMetrics = data.success.values.map((item) => ({
                        id: item.recordItemKey,
                        name: item.recordItemKey,
                    }));
                    setMetrics(fetchedMetrics);
                } else {
                    console.error('지표 목록을 불러오지 못했습니다.', data);
                }
            } catch (error) {
                console.error('지표 목록 API 통신 에러:', error);
            }
        };
        fetchMetrics();
    }, [experimentId]);

    // 상태 정도 선택 핸들러
    const handleStatusSelect = (metricId, status) => {
        setRecords((prev) => ({
        ...prev,
        [metricId]: status,
        }));
    };

    // 서버에서 지표를 불러오는 중이라 metrics가 0일 때 records, metrics 둘 다 0으로 같을 수 있어서 앞에 metrics.length > 0 추가해줌
    const isAllSelected = metrics.length > 0 && Object.keys(records).length === metrics.length;

    // 실험 전 상태 저장 핸들러 (유효성 검사)
    const handleSave = async () => {
        if (!isAllSelected) return;
        
        // 명세서: { "values": [ { "recordItemId": "피로도", "value": 6 } ] }
        const selectedValues = Object.entries(records).map(([key, value]) => ({
            recordItemId: key,
            value: value
        }));

        const payload = {
            values: selectedValues
        };

        setIsLoading(true);

        const token = localStorage.getItem('token');
        try {
        const response = await api.post(`/experiments/${experimentId}/pre-state`, payload, {
            headers: {
            'Authorization': `Bearer ${token}`
            },
        });

        const result = response.data;

        if (response.status === 200 && result.status === 200) {
            alert('실험 전 상태가 성공적으로 저장되었습니다!');
            navigate('/prerecorded');
        } else {
            alert(`저장 실패: ${result.message || '다시 시도해주세요.'}`);
        }
        } catch (error) {
            console.error('저장 API 호출 에러:', error);
            alert('서버와의 통신에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <div className="prerecord-container">
            {/*헤더*/}
            <header className="prerecord-header">
                <ArrowLeft className="prerecord-back-icon" onClick={goBackClick} />
                <div className="text-group">
                    <h2 className="prerecord-header-title">실험 전 상태</h2>
                    <p className="prerecord-header-describe">
                        실험 시작 전에 한 번만 기록해요<br/>
                        이후에는 자동으로 기준값으로 사용돼요
                    </p>
                </div>
            </header>

            <main className="status-select-section">
                {metrics.map((metric) => (
                    <MetricRow
                        key={metric.id}
                        title={metric.name}
                        selectedValue={records[metric.id]}
                        onSelect={(score) => handleStatusSelect(metric.id, score)}
                    />
                ))}
                <button className="save-button" disabled={isLoading || !isAllSelected} onClick={handleSave}>
                    기록 저장
                </button>
            </main>
        </div>
    )
}


// 상태 정도 선택하는 양식 따로 뺌
function MetricRow({ title, selectedValue, onSelect }) {
  const levels = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="metric-card">
      <h3 className="metric-title">{title}</h3>
      <div className="score-container">
        {levels.map((level) => (
          <button key={level} className={`score-button ${selectedValue === level ? 'selected' : ''}`} onClick={() => onSelect(level)}>
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Prerecord;
