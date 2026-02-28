import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import ButtonAnimated from "../Button/ButtonAnimated";
import "./Navbar.css";
import GoogleTranslate from "../GoogleTranslate/GoogleTranslate";
import { AppContext } from "../../context/AppContext";
import { IoMdLogOut } from "react-icons/io";
import Modal from "../Modal/Modal";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { token, userRole, setToken, setUserId, setUserRole } =
    useContext(AppContext);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUserId(null);
    setUserRole(null);
    setIsModalOpen(false);
    navigate("/");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Function to close the menu when a NavLink is clicked
  const closeMenu = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className={`navbar-links ${isOpen ? "open" : ""}`}>
        {token ? (
          <>
            {userRole === "Admin" && (
              <>
                <NavLink to={"/kreiraj"} onClick={closeMenu}>
                  <button>Kreiraj</button>
                </NavLink>
                <NavLink to={"/admin/all_users"} onClick={closeMenu}>
                  <button>Pregled korisnika</button>
                </NavLink>
                <NavLink to={"/pregled-atrakcija"} onClick={closeMenu}>
                  <button>Pregled atrakcija</button>
                </NavLink>
                <NavLink to={"/admin/allow_users"} onClick={closeMenu}>
                  <button>Korisnici na čekanju</button>
                </NavLink>
              </>
            )}
            {userRole === "User" && (
              <>
                <NavLink to={"/"} onClick={closeMenu}>
                  <button>Početna</button>
                </NavLink>
                <NavLink to={"/explore"} onClick={closeMenu}>
                  <button>Istraži</button>
                </NavLink>
                <NavLink to={"/aboutus"} onClick={closeMenu}>
                  <button>O nama</button>
                </NavLink>

                <NavLink to={"/user_home"} onClick={closeMenu}>
                  <button>Moj profil</button>
                </NavLink>
                {(userRole === "User" || !token) && <GoogleTranslate />}
              </>
            )}

            {userRole === "Local_company" && (
              <>
                <NavLink to={"/home_local"} onClick={closeMenu}>
                  <button>Pregled stranice</button>
                </NavLink>
                <NavLink to={"/local_company/stats"} onClick={closeMenu}>
                  <button>Statistika</button>
                </NavLink>
                <NavLink to={"/user_home"} onClick={closeMenu}>
                  <button>Moj profil</button>
                </NavLink>
              </>
            )}

            <button className="button" onClick={() => setIsModalOpen(true)}>
              Logout
              <IoMdLogOut size={20} />
            </button>
          </>
        ) : (
          <>
            <NavLink to={"/"} onClick={closeMenu}>
              <button>Početna</button>
            </NavLink>
            <NavLink to={"/explore"} onClick={closeMenu}>
              <button>Otkrij</button>
            </NavLink>
            <NavLink to={"/aboutus"} onClick={closeMenu}>
              <button>O nama</button>
            </NavLink>

            <NavLink to={"/login"} onClick={closeMenu}>
              <ButtonAnimated text={"Login"} />
            </NavLink>
            <NavLink to={"/register_user"} onClick={closeMenu}>
              <ButtonAnimated text={"Register"} />
            </NavLink>

            {(userRole === "User" || !token) && <GoogleTranslate />}
          </>
        )}
      </div>
      <div className="navbar-hamburger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {isModalOpen && (
        <Modal
          title="Logout?"
          description="Jeste li sigurni da želite da se izlogujete?"
          actionLabel="Logout"
          onAction={handleLogout}
          onClose={handleCloseModal}
        />
      )}
    </nav>
  );
};

export default Navbar;
