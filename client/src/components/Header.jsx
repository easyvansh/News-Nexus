import React,{useState, useEffect} from "react";
import {Link} from "react-router-dom";
import logo from '../assets/react.svg';
import countries from "./countries";


function Header(){
    const [active, setActive] = useState(false);
    const [showCountryDropdown,setShowCountryDropdown] = useState(false);
    const [showCategoryDropdown,setShowCategoryDropdown] = useState(false);
    const categories = ["business", "entertainment", "general", "health", "science", "sports", "technology","politics"]
    const [theme, setTheme] = useState("light-theme");
    
    useEffect(() => {
        document.body.className = theme;
      }, [theme])
      function toggleTheme() {
        if (theme === "light-theme") {
          setTheme("dark-theme")
        }
        else {
          setTheme("light-theme")
        }
      }
    return(
        <header className = "">
            <nav className="fixed top-0 left-0 w-full h-auto bg-gray-800 z-10 flex items-center justify-around">
            <h3 className="relative heading font-bold md:basis-1/6 text-2xl xs:basis-4/12 z-50 mt-5">News Nexus</h3>
                <span className="logo">
                    <img src={logo} alt="News Nexus">
                    </img>
                </span>
                <ul className={active ? "nav-ul flex gap-11 md:gap-14 xs:gap-12 lg:basis-3/6 md:basis-4/6 md:justify-end active" : " nav-ul flex gap-14 lg:basis-3/6 md:basis-4/6 justify-end"}>
                    <li>
                        <Link className="no-underline font-semibold" to = "/" onClick={()=> setActive(!active)}></Link>
                    </li>
                    <li className="dropdown-link">
                        <Link className="no-underline font-semibold flex-center gap-2" onClick={()=> {setShowCategoryDropdown(!showCategoryDropdown); setShowCategoryDropdown(false)}}>
                        Top Headlines
                        </Link>
                    </li>
                    <ul className={showCountryDropdown ? "dropdown p-2 show-dropdown" : "dropdown p-2"}>
                    {countries.map((element, index) => {
                        return (
                        <li key={index} onClick={() => { setShowCountryDropdown(!showCountryDropdown) }}>
                            <Link to={"/country/" + element?.iso_2_alpha} className="flex gap-3" type="btn"
                            onClick={() => {
                                setActive(!active)
                            }}>
                            <img
                                src={element?.png}
                                srcSet={`https://flagcdn.com/32x24/${element?.iso_2_alpha}.png 2x`}
                        
                                alt={element?.countryName} />
                            <span>{element?.countryName}</span>
                            </Link>
                        </li>
                        )
                    })}
                    </ul>
                    <li>
                    <Link className="no-underline font-semibold" to = "#" onClick={toggleTheme()}>
                    <input type="checkbox" className="checkbox" id="checkbox"/>
                        <button className="js__dark-mode-toggle dark-mode-toggle" type="button">
                        <span className="dark-mode-toggle__icon"></span>
                        <span className="dark-mode-toggle__text hidden--visually">dark mode</span>
                        </button>
                    </Link>
                    </li>
                    <li></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;