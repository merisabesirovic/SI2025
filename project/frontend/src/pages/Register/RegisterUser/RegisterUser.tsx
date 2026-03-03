import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../../config/api";
import styled from "styled-components";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";

const RegisterUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [message] = useState(
    "Lozinka mora imati jedno veliko slovo, 8 karaktera, jedan broj i jedan specijalni karakter"
  );
  const [usernameMessage] = useState(
    "Korisnicko ime mora biti malim slovima i bez razmaka."
  );
  const [warning, setWarning] = useState("");
  const [userInput, setUserInput] = useState({
    username: "",
    email: "",
    password: "",
    roles: ["User"],
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isPasswordValid = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    return passwordRegex.test(password);
  };

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isUsernameValid = (username: string) => {
    if (!username) return false;
    return /^[a-z0-9._-]+$/.test(username);
  };

  const normalizeUsername = (username: string) => {
    return username.replace(/\s+/g, "").toLowerCase();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const { username, email, password } = userInput;
    if (
      isUsernameValid(username) &&
      isEmailValid(email) &&
      isPasswordValid(password)
    ) {
      setEnabled(false);
    } else {
      setEnabled(true);
    }
  }, [userInput]);

  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUsernameValid(userInput.username)) {
      toast.error(usernameMessage);
      return;
    }
    RegisterUser(userInput);
  };

  async function RegisterUser(data: object) {
    try {
      setIsLoading(true);
      console.log("Sending data to API:", data);
      const response = await axios.post(`${BASE_URL}/account/register`, data);
      console.log("API Response:", response.data);
      toast.success("User registered successfully!");
      navigate("/confirm_email");
    } catch (error: any) {
      console.error("Error during registration:", error.response || error);
      if (error.response && error.response.data) {
        toast.error(`Error: ${error.response.data[0].description}`);
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <StyledWrapper>
      {isLoading && <Loader />}
      <form className="form" style={{ display: isLoading ? "none" : "block" }}>
        <p className="form-title">Registrujte se</p>
        <div className="input-container">
          <input
            placeholder="Korisničko ime (bez razmaka)"
            type="text"
            required
            value={userInput.username}
            pattern="^[a-z0-9._-]+$"
            title="Korisnicko ime mora biti malim slovima i bez razmaka."
            onChange={(e) =>
              setUserInput((prev) => ({
                ...prev,
                username: normalizeUsername(e.target.value),
              }))
            }
            onBlur={() => {
              if (!isUsernameValid(userInput.username)) {
                toast.error(usernameMessage);
              }
            }}
          />
        </div>

        <div className="input-container">
          <input
            placeholder="Unesite email"
            type="email"
            required
            value={userInput.email}
            onChange={(e) =>
              setUserInput((prev) => ({ ...prev, email: e.target.value }))
            }
            onBlur={() => {
              if (!isEmailValid(userInput.email)) {
                toast.error("Unesite važeći email!");
              }
            }}
          />
        </div>

        <div className="input-container">
          <input
            placeholder="Unesite lozinku"
            type={showPassword ? "text" : "password"}
            required
            value={userInput.password}
            onChange={(e) =>
              setUserInput((prev) => ({ ...prev, password: e.target.value }))
            }
            onFocus={() =>
              setWarning(
                "Lozinka mora imati jedno veliko slovo, 8 karaktera, jedan broj i jedan specijalni karakter."
              )
            }
            onBlur={() => {
              setWarning("");
              if (!isPasswordValid(userInput.password)) {
                toast.error(message);
              }
            }}
          />
          <span onClick={togglePasswordVisibility}>
            <svg
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
        {warning ? (
          <p style={{ color: "gray", fontSize: "11px", padding: "10px" }}>
            {warning}
          </p>
        ) : (
          ""
        )}

        <button
          className="submit"
          type="submit"
          onClick={handleClick}
          disabled={enabled}
        >
          Submit
        </button>

        <p className="signup-link">
          Već imate nalog? <Link to="/login">Ulogujte se ovde</Link>
        </p>
        <p className="signup-link">
          Ukoliko želite da kreirate nalog za svoje preduzeće{" "}
          <Link to="/register_company">Registrujte ga ovde</Link>
        </p>
      </form>

    </StyledWrapper>
  );
};
const StyledWrapper = styled.div`
  font-family: "Figtree", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;

  .form {
    background-color: #fff;
    margin-top: 20px;
    display: block;
    padding: 1.5rem;
    max-width: 400px;
    width: 100%;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .form-title {
    font-family: "IBM Plex Mono", monospace;
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 600;
    text-align: center;
    color: #e43b39;
    margin-bottom: 1rem;
  }

  .input-container {
    position: relative;
    margin-bottom: 1rem;
  }

  .input-container input,
  .input-container select {
    font-family: "Figtree", sans-serif;
    background-color: #fff;
    padding: 0.75rem;
    font-size: 1rem;
    line-height: 1.5rem;
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    outline: none;
  }

  .input-container span {
    display: grid;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0.75rem;
    padding: 0.5rem;
    place-content: center;
    cursor: pointer;
  }

  .input-container span svg {
    color: #9ca3af;
    width: 1.25rem;
    height: 1.25rem;
  }

  .submit {
    display: block;
    padding: 0.75rem;
    background-color: #e43b39;
    color: #ffffff;
    font-family: "IBM Plex Mono", monospace;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    width: 100%;
    border-radius: 0.5rem;
    text-transform: uppercase;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s ease;
  }

  .submit:hover {
    background-color: #c2312f;
  }

  .signup-link {
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.25rem;
    text-align: center;
    margin-top: 1rem;
  }

  .signup-link a {
    text-decoration: underline;
    color: #e43b39;
  }
`;
export default RegisterUser;

