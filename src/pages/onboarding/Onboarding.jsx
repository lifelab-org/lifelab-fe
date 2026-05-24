import React from "react";
import axios from "axios";
import "./Onboarding.css";

import logo from "../../assets/lifelab_logo.png";
import char from "../../assets/lifelab_char.png";
import talk from "../../assets/talk.png";

function Onboarding() {
  const handleKakaoLogin = async () => {
    try {
      // 1. 백엔드 명세서 스펙대로 카카오 로그인 인가 URL을 요청합니다 (쿠키 사용 X)
      const res = await axios.get("https://life-lab.shop/api/auth/kakao/login");

      console.log("카카오 URL 응답:", res.data);

      // 2. 응답받은 데이터 안에 redirectUrl이 있다면 그 주소창으로 브라우저를 이동시킵니다.
      if (res.data && res.data.data && res.data.data.redirectUrl) {
        window.location.href = res.data.data.redirectUrl;
      } else {
        console.error("응답 데이터 구조가 명세서와 다릅니다:", res.data);
      }
    } catch (err) {
      console.error("카카오 로그인 인가 URL을 가져오는 중 에러 발생:", err);
      alert("로그인 페이지를 불러오지 못했습니다. 서버 상태를 확인해 주세요.");
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
