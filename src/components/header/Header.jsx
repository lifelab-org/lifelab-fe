import { useState } from "react";
import "./Header.css";
import logo from "../../assets/lifelab_char.png";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const experiments = ["진행 예정 실험"];

  const [selected, setSelected] = useState("진행 중인 실험");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (exp) => {
    setSelected(exp);
    setIsOpen(false);
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
