import React, { useState } from "react"; // 1. useState 추가했긔!
import "./Onboarding.css";

import logo from "../../assets/lifelab_logo.png";
import char from "../../assets/lifelab_char.png";
import talk from "../../assets/talk.png";

function Onboarding() {
  // 2. 버튼이 중복으로 눌리지 않게 잠그는 자물쇠 상태이긔!
  const [isLoading, setIsLoading] = useState(false);

  const handleKakaoLogin = () => {
    if (isLoading) return; // 이미 눌린 상태면 아래 코드 실행 안 하고 튕겨내기!
    setIsLoading(true); // 클릭되자마자 버튼 바로 잠그기!

    // 백엔드 주소로 카카오 로그인 요청 날리기
    window.location.href = "https://life-lab.shop/api/auth/kakao/login";
  };

  return (
    <div className="onboarding-container">
      <div className="center-area">
        <img src={logo} className="lifelab-logo" alt="LifeLab Logo" />
        <img src={char} className="lifelab-char" alt="LifeLab Character" />
      </div>

      {/* 3. disabled={isLoading} 을 넣어서 로딩 중일 땐 버튼이 안 눌리게 물리적으로도 막아줍니다! */}
      <button
        className="login-button"
        onClick={handleKakaoLogin}
        disabled={isLoading}
      >
        <img src={talk} className="talk-icon" alt="Kakao Talk Icon" />
        {isLoading ? "로그인 중..." : "카카오 로그인"}
      </button>
    </div>
  );
}

export default Onboarding;
