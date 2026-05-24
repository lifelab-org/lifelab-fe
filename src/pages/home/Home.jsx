import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import NoOngoingExperiment from "../../components/empty-state/NoOngoingExperiment";
import "./Home.css";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const [experiments, setExperiments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        // 1. 콜백 대기방이 안전하게 저장해 둔 토큰을 로컬스토리지에서 꺼내옵니다.
        const token = localStorage.getItem("accessToken");

        // 만약 토큰이 없으면 로그인이 안 된 사용자이므로 안전하게 온보딩으로 튕겨줍니다.
        if (!token) {
          console.warn("인증 토큰 없음. 온보딩 페이지로 유도합니다.");
          navigate("/onboarding");
          return;
        }

        // 2. 백엔드 API 서버에 데이터 요청 (헤더에 Bearer 토큰 탑재)
        const res = await axios.get(
          "https://life-lab.shop/api/experiments/ongoing",
          {
            headers: {
              Authorization: `Bearer ${token}`, // 명세서대로 헤더 스펙 주입!
            },
          },
        );

        console.log("진행 중인 실험 목록 전체 응답:", res.data);

        // 3. 응답받은 가공 데이터 상태에 반영하기
        const data = res.data.data;

        if (Array.isArray(data)) {
          setExperiments(data); // 데이터가 배열이면 세팅!
        } else {
          console.log("응답받은 data가 배열 형식이 아닙니다:", data);
          setExperiments([]); // 방어코드 예외 처리
        }

        setIsLoading(false);
      } catch (error) {
        console.error("실험 데이터 가져오기 실패:", error);
        setErrorMessage(error.message);
        setIsLoading(false);
      }
    };

    fetchExperiments();
  }, [navigate]);

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
