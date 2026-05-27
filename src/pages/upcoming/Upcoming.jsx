import { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import Api from "../../api/Api"; // 기존 프로젝트에서 쓰던 공통 Api 인스턴스 사용

function Upcoming() {
  // 1. 초기값은 빈 배열([])로 둬야 처음에 map을 돌릴 때 에러가 안 남
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 2. 오타 수정 및 공통 Api로 GET 요청 처리
        const response = await Api.get("/experiments/upcoming");

        // 3. 백엔드 응답 구조(res.data.data)가 배열인 경우 상태에 저장
        const result = response.data?.success;
        if (Array.isArray(result)) {
          setData(result);
        } else if (result) {
          // 만약 단일 객체로 오면 배열로 감싸서 저장 (map 에러 방지)
          setData([result]);
        }
      } catch (error) {
        console.error("진행 예정 실험 조회 실패:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Header />

      <div className="upcoming-list">
        {data.map((item) => (
          <div key={item.experimentId}>
            <h3>{item.title}</h3>
            <p>{item.subtitle}</p>
            <span>{item.dDayLabel}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Upcoming;
