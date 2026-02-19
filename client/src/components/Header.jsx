import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoMark from "../assets/news-nexus-mark.svg";
import countries from "./countries";

function Header() {
  const [theme, setTheme] = useState(() => localStorage.getItem("news-nexus-theme") || "light");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("news-nexus-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === "light" ? "dark" : "light"));
  const activeCountry = location.pathname.startsWith("/country/") ? location.pathname.split("/")[2] : "";

  return (
    <header className="site-header">
      <div className="masthead-shell">
        <div className="masthead-top clean-masthead">
          <Link to="/" className="brand brand-main" aria-label="News Nexus Home">
            <img src={logoMark} alt="News Nexus" className="brand-logo" />
            <span>News Nexus</span>
          </Link>

          <div className="masthead-actions">
            <nav className="simple-nav" aria-label="Primary">
              <Link className="nav-link" to="/">
                All News
              </Link>
              <Link className="nav-link" to="/top-headlines/general">
                Top Headlines
              </Link>
            </nav>

            <label className="header-country">
              <span>Country</span>
              <select
                value={activeCountry}
                onChange={(event) => {
                  const iso = event.target.value;
                  if (iso) navigate(`/country/${iso}`);
                }}
                aria-label="Select country"
              >
                <option value="">Global</option>
                {countries.map((country) => (
                  <option key={country.iso_2_alpha} value={country.iso_2_alpha}>
                    {country.countryName}
                  </option>
                ))}
              </select>
            </label>

            <button className="theme-ring" onClick={toggleTheme} aria-label="Toggle theme" type="button">
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
