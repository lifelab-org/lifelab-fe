import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        // 1. 주소창 URL 파라미터에서 인가 코드 추출
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (!code) {
          console.warn("인가 코드가 존재하지 않습니다.");
          navigate("/onboarding");
          return;
        }

        console.log("낚아챈 카카오 인증 코드:", code);

        // 2. 명세서에 나와 있는 콜백 엔드포인트로 인가 코드 실어서 토큰 요청
        const res = await axios.get(
          `https://life-lab.shop/api/auth/kakao/callback?code=${code}`,
        );

        console.log("백엔드 토큰 발급 응답:", res.data);

        // 3. 토큰 안전하게 저장 후 홈으로 워프!
        if (
          res.data &&
          res.data.result === "Success" &&
          res.data.data &&
          res.data.data.accessToken
        ) {
          const token = res.data.data.accessToken;
          localStorage.setItem("accessToken", token);
          navigate("/");
        } else {
          console.error("토큰 구조 불일치 에러:", res.data);
          navigate("/onboarding");
        }
      } catch (err) {
        console.error("토큰 발급 API 통신 실패:", err);
        navigate("/onboarding");
      }
    };

    fetchAccessToken();
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h2 style={{ color: "#333", marginBottom: "10px" }}>
          카카오 로그인 처리 중...
        </h2>
        <p style={{ color: "#777" }}>
          잠시만 기다려 주시면 홈 화면으로 이동합니다. ⏳
        </p>
      </div>
    </div>
  );
}

export default KakaoCallback;
