import React from "react";
import axios from "axios";
import { GrFavorite } from "react-icons/gr";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import BASE_URL from "../../../config/api";

type AddToFavoritesProps = {
  attractionName: string;
};

const AddToFavorites = ({ attractionName }: AddToFavoritesProps) => {
  const token = localStorage.getItem("token");

  const handleAddToFavorites = async () => {
    if (!token) {
      toast.error("Morate biti prijavljeni da biste dodali u favorite.");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/portfolio?name=${encodeURIComponent(
          attractionName
        )}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Uspešno dodato u favorite!");
      console.log(attractionName);
    } catch (error: any) {
      console.log(attractionName);
      const errorMessage =
        error.response?.data || "Došlo je do greške. Pokušajte ponovo.";
      toast.error(errorMessage);
    }
  };

  return (
    <StyledWrapper>
      <div>
        <h2 className="form-title">Već ste bili ovde ili želite da posetite ovo mesto?</h2>
        <p>
          Dodajte ga u favorite, a mi ćemo vam predložiti još ovakvih mesta.
        </p>
        {token ? (
          <button className="submit" onClick={handleAddToFavorites}>
            Dodaj {<GrFavorite />}
          </button>
        ) : (
          <div className="login-prompt">
            <p>Morate biti prijavljeni da biste dodali u favorite.</p>
          </div>
        )}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled("div")`
  font-family: "Figtree", sans-serif;
  width: 100%;
  margin-top: 20px;
  padding: 2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: beige;

  .submit {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.75rem;
    background-color: #e43b39;
    color: #ffffff;
    font-family: "IBM Plex Mono", monospace;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    width: 100%;
    max-width: 200px;
    border-radius: 0.5rem;
    text-transform: uppercase;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s ease;
    margin: 10px;
  }

  .submit:hover {
    background-color: #c2312f;
  }

  .form-title {
    margin: 20px;
    color: #2e2e2d;
  }

  .login-prompt {
    padding: 10px;
    background-color: #f1f1f1;
    text-align: center;
  }
`;

export default AddToFavorites;
