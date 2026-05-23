import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./Onboarding.css";

import logo from "../../assets/lifelab_logo.png";
import char from "../../assets/lifelab_char.png";
import talk from "../../assets/talk.png";

function Onboarding() {
  // const handleKakaoLogin = async () => {
  //   try {
  //     const res = await axios.get("https://life-lab.shop/api/auth/kakao/login");

  //     window.location.href = res.data.data.redirectUrl;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleKakaoLogin = () => {
    window.location.href = "https://life-lab.shop/api/auth/kakao/login";
  };
  return (
    <div className="onboarding-container">
      <div className="center-area">
        <img src={logo} className="lifelab-logo" />
        <img src={char} className="lifelab-char" />
      </div>

      <button className="login-button" onClick={handleKakaoLogin}>
        <img src={talk} className="talk-icon" />
        카카오 로그인
      </button>
    </div>
  );
}

export default Onboarding;
