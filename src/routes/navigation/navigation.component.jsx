import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import ig_icon from "../../assets/ig-instagram-icon.svg";
import waze_icon from "../../assets/icons8-waze-100.png";
import language from "../../assets/language-svgrepo-com.svg";
import CartIcon from "./../../components/cart/cart-icon.component.jsx";
import Minicart from "../../components/cart/minicart.component.jsx";
import { logOutUser } from "../../utils/firebase/firebase.utils";
import Logo from "../../assets/crown.png";
import "./navigation.styles.scss";
import useOutsideClicker from "./useOutsideClicker.js";

const Navigation = ({ switchLanguage }) => {
  const currentUser = useSelector((state) => state.user.currentUser);

  const [openLanguage, setOpenLanguage] = useState(false);
  const [animate, setAnimate] = useState(false);
  const closeLanguage = () => {
    setOpenLanguage(false);
  };
  const ref = useOutsideClicker(closeLanguage);
  const toggleLanguage = () => {
    setOpenLanguage((prev) => !prev);
  };

  const changeLanguage = (lang) => {
    switchLanguage(lang);
    closeLanguage();
  };

  useEffect(() => {
    if (openLanguage) {
      const timer = setTimeout(() => setAnimate(true), 150);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setAnimate(false), 150);
      return () => clearTimeout(timer);
    }
  }, [openLanguage]);

  return (
    <>
      <div className="navigation">
        <div className="navigation-content">
          <Link className="logo-container" to={"/"}>
            <img src={Logo} alt="" className="" />
          </Link>
          {/* <h1>
            <FormattedMessage id="welcome" defaultMessage="Welcome" />
          </h1> */}

          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={ig_icon}
                style={{ width: "28px", height: "28px", cursor: "pointer" }}
                alt="icon"
              />
            </a>
            <img
              src={waze_icon}
              style={{ width: "42px", height: "42px", cursor: "pointer" }}
              alt="icon"
            />
            <div className="language-container">
              <img
                src={language}
                alt=""
                className=""
                onClick={toggleLanguage}
              />
              {openLanguage && (
                <div
                  ref={ref}
                  className={`language-dropdown-container ${
                    animate ? "show" : ""
                  }`}
                >
                  <div className="item" onClick={() => changeLanguage("ar")}>
                    عربي
                  </div>
                  <div className="divider" />
                  <div className="item" onClick={() => changeLanguage("heb")}>
                    עברית
                  </div>
                </div>
              )}
            </div>

            <CartIcon />
            <Minicart />
          </div>

          {/* <div className="nav-links-container">
            <Link className="nav-link" to={"/shop"}>
              Shop All
            </Link>
            {currentUser === "logged-out" && (
              <Link className="nav-link" to={"/login"}>
                Login
              </Link>
            )}
            {currentUser !== null && currentUser !== "logged-out" && (
              <span onClick={logOutUser} className="nav-link">
                Logout
              </span>
            )}
            <CartIcon />
          </div> */}
        </div>
      </div>
      <Outlet />
      {/* <FooterComponent /> */}
    </>
  );
};

export default Navigation;
