import React, { useContext, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../../config/api";
import { AppContext } from "../../context/AppContext";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setToken, setUserId, setUserRole } = useContext(AppContext);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const loginUser = async (data: any) => {
    try {
      console.log(data);
      const response = await axios.post(`${BASE_URL}/account/login`, data);
      console.log(data);
      console.log(response.data);
      const token = response.data.token;
      const id = response.data.userId;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const user = response.data.roles[0];
      localStorage.setItem("token", token);
      localStorage.setItem("id", id);
      localStorage.setItem("role", user);
      localStorage.setItem("username", response.data.userName);
      user === "Admin"
        ? navigate("/admin/all_users")
        : user === "User"
        ? navigate("/user_home")
        : navigate("/home_local");
      console.log(user);
      setToken(token);
      setUserId(id);
      setUserRole(user);
    } catch (err: any) {
      console.log(data);
      toast.error(err.response.data);
      localStorage.removeItem("token");
      setError(err.response.data);
      console.log(err.response.data);
    }
  };

  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({ UserName: userName, Password: password });
  };
  const handleNavigate = () => {
    navigate("/forgot_password");
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleClick}>
        <p className="form-title">Ulogujte se</p>
        <div className="input-container">
          <input
            placeholder="Unesite korisničko ime"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <span>
            <svg
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
        <div className="input-container">
          <input
            placeholder="Unesite lozinku"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        <button className="submit" type="submit" onClick={handleClick}>
          Submit
        </button>
        <p className="signup-link" onClick={() => navigate("/register_user")}>
          Nemate nalog? <span>Kreirajte ga ovde.</span>
        </p>
        <p className="signup-link" onClick={handleNavigate}>
          Zaboravili ste lozinku?
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

  .input-container input {
    font-family: "Figtree", sans-serif;
    background-color: #fff;
    padding: 0.75rem;
    padding-right: 3rem;
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
    cursor: pointer;
  }

  .signup-link span {
    text-decoration: underline;
    color: #e43b39;
  }

  @media (max-width: 480px) {
    .form {
      padding: 1rem;
    }

    .form-title {
      font-size: 1.25rem;
    }

    .input-container input {
      font-size: 0.875rem;
    }

    .submit {
      font-size: 0.875rem;
    }
  }
`;

export default Login;
