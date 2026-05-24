import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // 백엔드가 이미 쿠키에 토큰을 심어줬고, 인가 코드도 지들이 처리했으니
    // 프론트는 아무것도 묻지도 따지지도 말고 바로 홈 화면으로 유저를 들여보냅니다!
    console.log("백엔드가 쿠키 심어준 거 확인! 홈 화면으로 워프합니다. 🚀");

    // 메인 홈 화면 주소로 이동 (프로젝트 메인 경로가 '/' 가 아니라 '/home' 이면 그걸로 적으셔긔!)
    navigate("/");
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
          카카오 로그인 완료!
        </h2>
        <p style={{ color: "#777" }}>잠시 후 메인 화면으로 이동합니다. ⏳</p>
      </div>
    </div>
  );
}

export default KakaoCallback;
