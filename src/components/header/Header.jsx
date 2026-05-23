import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/lifelab_char.png";

export default function Header() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();

  const selected =
    location.pathname === "/upcoming" ? "진행 예정 실험" : "진행 중인 실험";

  const experiments =
    selected === "진행 예정 실험" ? ["진행 중인 실험"] : ["진행 예정 실험"];
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (exp) => {
    setIsOpen(false);

    if (exp === "진행 예정 실험") {
      navigate("/upcoming");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="header">
      <img src={logo} className="lifelab_char" alt="logo" />

      <div className="dropdown">
        <div className="dropdown-header" onClick={toggleDropdown}>
          {selected}
          <span className={`arrow ${isOpen ? "open" : ""}`}>▼</span>
        </div>

        {isOpen && (
          <div className="dropdown-menu">
            {experiments.map((exp, idx) => (
              <div
                key={idx}
                className="dropdown-item"
                onClick={() => handleSelect(exp)}
              >
                {exp}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
