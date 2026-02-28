import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import BASE_URL from "../../../config/api";
import styled from "styled-components";
import Loader from "../../../components/Loader/Loader";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [enabled, setEnabled] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const isPasswordValid = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    return passwordRegex.test(password);
  };
  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");
    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !token || !isPasswordValid(newPassword)) {
      toast.error(
        "Sva polja su obavezna i lozinka mora ispunjavati kriterijume."
      );
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${BASE_URL}/account/reset-password`, {
        email,
        token,
        newPassword,
      });
      toast.success("Lozinka je uspešno promenjena!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data[0].description || "Došlo je do greške.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledWrapper>
      {isLoading && <Loader />}
      <h2>Kod za resetovanje lozinke Vam je poslat. Proverite email.</h2>
      <form
        onSubmit={handleResetPassword}
        style={{ display: isLoading ? "none" : "block" }}
      >
        <h2>Resetujte lozinku</h2>

        <div className="input-container">
          <input
            type="email"
            placeholder="Potvrdite vaš email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            placeholder="Unesite novu lozinku"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            onFocus={() =>
              setMessage(
                "Lozinka mora imati jedno veliko slovo, 8 karaktera, jedan broj i jedan specijalni karakter."
              )
            }
            onBlur={() => {
              setMessage("");
            }}
          />
        </div>
        {message ? (
          <p style={{ color: "gray", fontSize: "11px", padding: "10px" }}>
            {message}
          </p>
        ) : (
          ""
        )}
        <div className="input-container">
          <input
            type="text"
            placeholder="Unesite kod dobijen preko email-a"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={enabled}>
          Resetuj
        </button>
      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* Styling for ForgotPassword page */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;
  flex-direction: column;

  form {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 100%;
    max-width: 600px;
  }

  h2 {
    color: #e43b39;
    margin-bottom: 1rem;
  }

  p {
    color: #6b7280;
    margin-bottom: 1rem;
  }

  .input-container {
    margin-bottom: 1rem;
  }

  input {
    padding: 0.75rem;
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    outline: none;
  }

  button {
    background-color: #e43b39;
    color: white;
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:disabled {
    background-color: #c2312f;
    cursor: not-allowed;
  }
`;

export default ResetPassword;
