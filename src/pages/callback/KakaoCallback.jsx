import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../api/Api"; // 🚨 은우님 원래 폴더 구조에 맞춘 경로구랴!

function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // 백엔드 오피셜 명세서 주소 '/auth/me'로 쿠키(credentials) 실어서 전송!
    Api.get("/auth/me")
      .then((res) => {
        // 백엔드가 쿠키 확인 완료하고 200 오피셜 성공 응답을 주면
        console.log("백엔드가 쿠키 확인 완료함! 로그인 대성공!! 🎉", res.data);

        // 무한 루프 안 돌고 안전하게 대문(메인 홈) 화면으로 이동!
        navigate("/", { replace: true });
      })
      .catch((err) => {
        // 쿠키가 없거나 만료(401 등)되어 에러가 나면 온보딩으로 이동
        console.error("인증 실패 또는 토큰 유실:", err);
        navigate("/onboarding", { replace: true });
      });
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#fff",
      }}
    >
      <h2 style={{ color: "#333" }}>
        카카오 로그인 완료 후 상태 확인 중... 🚀
      </h2>
    </div>
  );
}

export default KakaoCallback;
