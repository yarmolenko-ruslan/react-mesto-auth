function Header(props) {
  return (
    <header className="header">
      <a
        href={props.logo}
        alt="Логотип проекта Mesto"
        className="logo link"
      ></a>
    </header>
  );
}

export default Header;
