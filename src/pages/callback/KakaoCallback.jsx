import { useEffect, useRef } from "react"; // 1. useRef 추가!
import { useNavigate, useSearchParams } from "react-router-dom"; // 2. useSearchParams 추가!
import Api from "../../api/Api";

function KakaoCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasCalled = useRef(false); // 🔥 1초에 수백 번 찌르는 루프를 물리적으로 막는 방어막!

  useEffect(() => {
    // 이미 백엔드에 요청을 보냈다면 두 번 다시 실행 안 하고 리턴 (중복 호출 원천 차단!)
    if (hasCalled.current) return;

    // 주소창 뒤에 붙어오는 ?code=... 에서 인가 코드를 뜯어냅니다.
    const code = searchParams.get("code");

    if (code) {
      hasCalled.current = true; // 요청 출발하기 직전에 자물쇠 딱 걸기!
      console.log(
        "카카오 인가코드 발견! 백엔드에 최종 토큰 교환 요청을 날립니다. 🚀",
      );

      // 백엔드가 하라고 한대로 withCredentials가 켜진 Api 그릇으로 최종 인증 요청!
      Api.get(`/auth/kakao/callback?code=${code}`)
        .then(() => {
          console.log(
            "백엔드가 브라우저에 쿠키 굽기 성공 완료! 이제 안심하고 홈으로 이동하긔! 🎉",
          );
          navigate("/", { replace: true }); // 성공하면 홈 화면으로 무사 입성!
        })
        .catch((err) => {
          console.error("토큰 교환 중 에러 발생 😭:", err);
          // 에러 나면 무한 루프 돌지 않게 로그인 창으로 안전하게 퇴장
          navigate("/onboarding", { replace: true });
        });
    }
  }, [searchParams, navigate]);

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
