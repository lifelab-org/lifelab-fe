import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // 백엔드가 이미 유저 브라우저 쿠키에 access_token을 심어준 상태이긔!
    // 프론트는 주소창 뜯지 말고, 바로 메인 홈 화면으로 유저를 들여보냅니다.
    console.log(
      "백엔드 오피셜 쿠키 방식 확인! 홈 화면으로 무사 워프합니다. 🚀",
    );

    // 메인 홈 화면 주소로 이동 (replace: true로 뒤로가기 방지!)
    navigate("/", { replace: true });
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
