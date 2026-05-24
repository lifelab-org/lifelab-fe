import React from "react";
import "./Onboarding.css";

import logo from "../../assets/lifelab_logo.png";
import char from "../../assets/lifelab_char.png";
import talk from "../../assets/talk.png";

function Onboarding() {
  const handleKakaoLogin = () => {
    //명세서랑 다르게 302로 보냄 걍
    window.location.href = "https://life-lab.shop/api/auth/kakao/login";
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
