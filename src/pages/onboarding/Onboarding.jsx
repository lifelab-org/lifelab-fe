import React from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";
import logo from "../../assets/lifelab_logo.png";
import char from "../../assets/lifelab_char.png";
import talk from "../../assets/talk.png";

function Onboarding() {
  const navigate = useNavigate();

  const handleStart = () => {
    localStorage.setItem("onboarding", "done");
    navigate("/");
  };

  return (
    <div className="onboarding-container">
      <div className="center-area">
        <img src={logo} className="lifelab-logo" />
        <img src={char} className="lifelab-char" />
      </div>

      <button className="login-button" onClick={handleStart}>
        <img src={talk} className="talk-icon" />
        카카오 로그인
      </button>
    </div>
  );
}

export default Onboarding;
