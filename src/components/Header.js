import logo from "../images/logo.svg";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Header({ email, exit }) {
  const [path, setPath] = useState("");

  const location = useLocation();
  useEffect(() => {
    setPath(location.pathname);
  }, [location]);

  let linkText = "";
  let link = "";
  let isEmailVisible = false;

  if (path == "/sign-up") {
    linkText = "Войти";
    link = "/sign-in";
    isEmailVisible = false;
  } else if (path == "/sign-in") {
    linkText = "Регистрация";
    link = "/sign-up";
    isEmailVisible = false;
  } else {
    linkText = "Выйти";
    link = "/sign-in";
    isEmailVisible = true;
  }

  

  return (
    <header className="header">
      <a href={logo} alt="Логотип проекта Mesto" className="logo link"></a>
      <div className="header__info">
        <p className="header__email">{isEmailVisible ? email : ""}</p>
        <Link to={link} className="header__auth" onClick={exit}>
          {linkText}
        </Link>
      </div>
    </header>
  );
}

export default Header;
