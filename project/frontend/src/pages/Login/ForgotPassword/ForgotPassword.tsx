import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../../../config/api";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/account/forgot-password`, {
        email,
      });
      toast.success(
        "Link za resetovanje lozinke poslat je na vašu email adresu."
      );

      navigate("/reset_password");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Došlo je do greške prilikom slanja zahteva."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledWrapper>
      {isLoading && <Loader />}
      <form
        onSubmit={handleForgotPassword}
        style={{ display: isLoading ? "none" : "block" }}
      >
        <h2>Zaboravili ste lozinku?</h2>
        <p>
          Unesite svoju email adresu da biste dobili link za resetovanje
          lozinke.
        </p>
        <div className="input-container">
          <input
            type="email"
            placeholder="Unesite vašu email adresu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          Pošalji
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

  form {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
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

export default ForgotPassword;
