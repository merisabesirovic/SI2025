import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import Modal from "../Modal/Modal";
import "./Card.css";
import EditModal from "../Modal/EditModal";
import BASE_URL from "../../config/api";

type CardProps = {
  image: string;
  title: string;
  description: string;
  id: string;
  show: Boolean;
  onUpdate?: (updatedAttraction: any) => void;
  extraInfo?: string;
};

const Card: React.FC<CardProps> = ({
  image,
  title,
  description,
  id,
  show,
  onUpdate,
  extraInfo,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [name, setName] = useState(title);
  const [desc, setDesc] = useState(description);
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [category, setCategory] = useState("");
  const [attraction, setAttraction] = useState<any>(null);


  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteAction = async () => {
    try {
      await axios.delete(`${BASE_URL}/tourist_attractions/${id}`);
      setIsDeleted(true);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting attraction:", error);
    }
  };

  const handleUpdateAttraction = async (
  imagesToDelete: string[],
  newImages: File[]
) => {
  try {
    console.log('tr');
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", desc);
    formData.append("longitude", longitude);
    formData.append("latitude", latitude);
    formData.append("category", category);

    imagesToDelete.forEach((img) =>
      formData.append("ImagesToDelete", img)
    );

    newImages.forEach((file) =>
      formData.append("NewImages", file)
    );

    const response = await axios.put(
      `${BASE_URL}/tourist_attractions/${id}`,
      formData,
    );

    setAttraction(response.data);
    setIsEditModalOpen(false);

    if (onUpdate) {
      onUpdate(response.data);
    }
  } catch (error) {
    console.log('gr')
    console.error("Error updating attraction:", error);
  }
};


const handleEditClick = async (e: React.MouseEvent) => {
  e.preventDefault();
  setIsEditModalOpen(true);

  try {
    const response = await axios.get(
      `${BASE_URL}/tourist_attractions/${id}`
    );

    const data = response.data;
    setAttraction(data);

    setName(data.name);
    setDesc(data.description);
    setLongitude(data.longitude);
    setLatitude(data.latitude);
    setCategory(data.category);
  } catch (error) {
    console.error("Error fetching attraction details:", error);
  }
};


  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  

  if (isDeleted) return null;

  return (
    <div>
      {show ? (
        <div className="icons-container">
          <div className="extra-info">{extraInfo}</div>
          <MdDelete size={30} onClick={handleDeleteClick} />
          <FaEdit size={30} onClick={handleEditClick} />
        </div>
      ) : (
        <></>
      )}

      <NavLink to={`/attractions/${id}`}>
        <StyledCard>
          <div className="card-content">
            <div
              className="card-image"
              style={{ backgroundImage: `url(${image})` }}
            />
            <div className="wave-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path
                  fill="#086363"
                  fillOpacity="0.7"
                  d="M0,0L48,21.3C96,43,192,85,288,96C384,107,480,85,576,112C672,139,768,213,864,224C960,235,1056,181,1152,181.3C1248,181,1344,235,1392,261.3L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
              </svg>
            </div>
            <div className="text-content">
              <h2 className="crd-title">{title}</h2>
              <p className="card-description">{description}</p>
            </div>
            {extraInfo && !show && (
              <div className="extra-info">{extraInfo}</div>
            )}
          </div>
        </StyledCard>
      </NavLink>

      {isModalOpen && (
        <Modal
          title="Brisanje turističke atrakcije"
          description="Da li ste sigurni da želite da izbrišete turističku atrakciju?"
          actionLabel="Izbriši"
          onAction={handleDeleteAction}
          onClose={handleCloseModal}
        />
      )}

      {isEditModalOpen && attraction && (
  <EditModal
    title="Izmena atrakcije"
    name={name}
    description={desc}
    longitude={longitude}
    latitude={latitude}
    category={category}
    photos={attraction.photos}
    onSave={handleUpdateAttraction}
    onClose={handleCloseEditModal}
    setName={setName}
    setDesc={setDesc}
    setLongitude={setLongitude}
    setLatitude={setLatitude}
    setCategory={setCategory}
  />
)}

    </div>
  );
};

const StyledCard = styled.div`
  width: 350px;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .card-content {
    position: relative;
    height: 100%;
  }

  .card-image {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    filter: brightness(30%);
  }

  .wave-wrapper {
    position: absolute;
    bottom: 0;
    margin-bottom: -5px;
    left: 0;
    width: 100%;
    z-index: 1;
  }

  .text-content {
    position: relative;
    padding: 16px;
    z-index: 2;
    color: #fff;
    position: absolute;
    bottom: 50px;
    left: 0;
    right: 0;

    .crd-title {
      font-size: 22px;
      margin: 0 0 8px;
      color: #fff;
      background-color: rgba(216, 76, 71, 0.8);
      display: inline;
      padding: 7px;
      font-weight: 600;
    }

    .card-description {
      font-size: 16px;
      color: #fff;
    }
  }

  .extra-info {
    position: absolute;
    bottom: 20px;
    left: 16px;
    right: 16px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 8px;
    border-radius: 8px;
    text-align: center;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    z-index: 3;
  }

  &:hover .extra-info {
    opacity: 1;
  }
`;

export default Card;
