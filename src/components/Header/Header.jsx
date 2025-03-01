import { Link } from "react-router-dom";
import "./Header.css"; // Import the CSS file

const Header = () => {
  return (
    <header className="header">
      {/* Brand Name */}
      <div className="header-brand">
        <Link to="/">NeroFilm</Link>
      </div>

      {/* Navigation */}
      <nav>
        <ul className="header-nav">
          <li>
            <Link to="/try-it">Try It</Link>
          </li>
          <li>
            <Link to="/about-us">About Us</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
