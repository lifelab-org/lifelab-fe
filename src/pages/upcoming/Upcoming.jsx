import Header from "../../components/header/Header";
import { useState, useEffect } from "react";
// import axios from "axios";

function Upcoming() {
  const dummyData = [
    { id: 1, title: "운동 습관 만들기" },
    { id: 2, title: "아침 기상 루틴" },
  ];

  const [data, setData] = useState(dummyData);

  /*
  // API 호출 예시
  useEffect(() => {
    const fetchData = async () => {
      try {
        // GET 요청 예시
        const response = await axios.get("/api/experiments/upcoming");

        // 데이터 확인
        console.log(response.data);

        // 상태 저장 (필요하면 useState 추가해서 setState)
        // setData(response.data);

      } catch (error) {
        // 에러 처리
        console.error("API 호출 에러:", error);
      }
    };

    fetchData();
  }, []);
  */
  return (
    <div>
      <Header />

      <div className="content">
        {data.map((item) => (
          <div key={item.id}>{item.title}</div>
        ))}
      </div>
    </div>
  );
}

export default Upcoming;
