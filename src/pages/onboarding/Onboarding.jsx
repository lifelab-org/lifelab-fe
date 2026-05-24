import React from "react";
import axios from "axios";
import "./Onboarding.css";

import logo from "../../assets/lifelab_logo.png";
import char from "../../assets/lifelab_char.png";
import talk from "../../assets/talk.png";

function Onboarding() {
  const handleKakaoLogin = async () => {
    try {
      // 1. [명세서 스펙 규격대로] 백엔드에 GET 요청을 보내 응답 데이터를 받아옵니다.
      const res = await axios.get("https://life-lab.shop/api/auth/kakao/login");

      console.log("백엔드 응답 데이터:", res.data);

      // 2. 명세서에 적힌 성공 구조 { success: true, data: { redirectUrl: "..." } } 그대로 검사합니다.
      if (
        res.data &&
        res.data.success &&
        res.data.data &&
        res.data.data.redirectUrl
      ) {
        // 3. 명세서 가이드대로 전달받은 redirectUrl 주소로 브라우저를 이동시킵니다!
        window.location.href = res.data.data.redirectUrl;
      } else {
        console.error(
          "응답은 왔으나 명세서에 적힌 데이터 구조와 다릅니다.",
          res.data,
        );
      }
    } catch (err) {
      console.error("카카오 로그인 URL 요청 실패:", err);
      alert("로그인 요청 중 오류가 발생했습니다. 서버 상태를 확인해주세요.");
    }
  };

  return (
    <div className="onboarding-container">
      <div className="center-area">
        <img src={logo} className="lifelab-logo" alt="LifeLab Logo" />
        <img src={char} className="lifelab-char" alt="LifeLab Character" />
      </div>

      <button className="login-button" onClick={handleKakaoLogin}>
        <img src={talk} className="talk-icon" alt="Kakao Talk Icon" />
        카카오 로그인
      </button>
    </div>
  );
}

export default Onboarding;
