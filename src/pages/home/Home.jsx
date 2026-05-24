import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/header/Header";
import NoOngoingExperiment from "../../components/empty-state/NoOngoingExperiment";
import "./Home.css";
import axios from "axios";

export default function Home() {
  const [experiments, setExperiments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        // 만약 토큰이 없다면 에러를 띄우거나 로그인 페이지로 보낼 수 있도록 예외 처리
        if (!token) {
          console.warn("로그인 토큰이 존재하지 않습니다.");
          // 필요시 여기에 로그인 페이지 리다이렉트 코드를 넣을 수 있긔!
        }

        // 2. 백엔드 API 서버에 진짜 데이터 요청하기
        const res = await axios.get(
          "https://life-lab.shop/api/experiments/ongoing",
          {
            withCredentials: true, //[핵심] 쿠키를 주고받으려면 이 한 줄이 무조건 있어야 하긔!
            headers: {
              Authorization: `Bearer ${token}`, // 혹시 헤더 토큰도 같이 쓰면 유지!
            },
          },
        );

        console.log("전체 응답:", res);
        console.log("응답 데이터:", res.data);

        // 3. 받아온 응답에서 데이터 가공 후 상태에 저장하기
        const data = res.data.data;

        if (Array.isArray(data)) {
          setExperiments(data); // 배열이 맞으면 그대로 세팅!
        } else {
          console.log("data가 배열이 아님:", data);
          setExperiments([]); // 배열이 아니면 빈 배열로 안전하게 예외처리
        }

        setIsLoading(false);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        setErrorMessage(error.message);
        setIsLoading(false);
      }
    };

    fetchExperiments();
  }, []);

  if (isLoading)
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>로딩중...</div>
    );
  if (errorMessage)
    return (
      <div style={{ color: "red", padding: "20px" }}>
        에러 발생: {errorMessage}
      </div>
    );

  return (
    <div className="home-container">
      <Header />

      <main className="home-main">
        {experiments.length === 0 ? (
          <div className="empty-wrapper">
            <NoOngoingExperiment />
          </div>
        ) : (
          <div className="experiment-list">
            {experiments.map((exp) => (
              <Link
                key={exp.id}
                to="/record"
                className={`experiment-card ${exp.id === 1 ? "highlight" : ""}`}
              >
                <h3 className="experiment-title">{exp.title}</h3>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
