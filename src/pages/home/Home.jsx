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
        // 1. [핵심 리다이렉트 연동] 주소창(URL) 파라미터에 토큰이 실려왔는지 검사합니다.
        const urlParams = new URLSearchParams(window.location.search);

        // 백엔드가 주소창 뒤에 'token' 또는 'accessToken' 중 어떤 이름으로 보내든 둘 다 잡아내도록 세팅!
        const urlToken = urlParams.get("token") || urlParams.get("accessToken");

        // 만약 주소창에 토큰이 있다면, 로컬스토리지에 저장하고 주소창을 깔끔하게 정리합니다.
        if (urlToken) {
          localStorage.setItem("accessToken", urlToken);
          // 주소창 뒤의 ?token=... 복잡한 파라미터를 밀어버리고 깔끔한 원래 주소("/")로 바꿉니다.
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        }

        // 2. 로컬스토리지에서 안전하게 저장된 토큰을 꺼내옵니다.
        const token = localStorage.getItem("accessToken");

        // 만약 토큰이 없다면 로그인이 안 된 것이므로 로그인 경고를 띄웁니다.
        if (!token) {
          console.warn(
            "로그인 토큰이 존재하지 않습니다. 온보딩 페이지로 이동이 필요할 수 있습니다.",
          );
        }

        // 3. 백엔드 API 서버에 데이터 요청하기 (쿠키를 안 쓰므로 크로스 도메인 403 차단 에러 해결!)
        const res = await axios.get(
          "https://life-lab.shop/api/experiments/ongoing",
          {
            headers: {
              Authorization: `Bearer ${token}`, // 명세서대로 발급받은 토큰을 헤더에 실어서 전송!
            },
          },
        );

        console.log("전체 응답:", res);
        console.log("응답 데이터:", res.data);

        // 4. 받아온 응답에서 데이터 가공 후 상태에 저장하기
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
