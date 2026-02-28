import React, { useState } from "react";
import styled from "styled-components";

interface EditModalProps {
  title: string;
  name: string;
  description: string;
  longitude: string;
  latitude: string;
  category: string;
  photos: string[];

  onSave: (imagesToDelete: string[], newImages: File[]) => void;
  onClose: () => void;

  setName: React.Dispatch<React.SetStateAction<string>>;
  setDesc: React.Dispatch<React.SetStateAction<string>>;
  setLongitude: React.Dispatch<React.SetStateAction<string>>;
  setLatitude: React.Dispatch<React.SetStateAction<string>>;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}

const EditModal: React.FC<EditModalProps> = ({
  title,
  name,
  description,
  longitude,
  latitude,
  category,
  photos,
  onSave,
  onClose,
  setName,
  setDesc,
  setLongitude,
  setLatitude,
  setCategory,
}) => {
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  const toggleDelete = (url: string) => {
    setImagesToDelete((prev) =>
      prev.includes(url)
        ? prev.filter((i) => i !== url)
        : [...prev, url]
    );
  };

  return (
    <StyledOverlay>
      <StyledWrapper>
        <div className="card large">
          <button className="exit-button" onClick={onClose}>
            ✕
          </button>

          <p className="card-heading">{title}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSave(imagesToDelete, newImages);
            }}
          >
            <div className="grid">
              <input
                placeholder="Naziv"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
               <option value="islamic">Islamski spomenik</option>
               <option value="christian">Hrišćanski spomenik</option>
              <option value="natural">Spomenik prirode</option>
              <option value="hotel">Hotel</option> 
              <option value="restaurants">Restoran</option>
              <option value="cafe">Kafić</option>
              <option value="historic">Istorijski spomenik</option>
              </select>

              <input
                placeholder="Geografska dužina"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />

              <input
                placeholder="Geografska širina"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>

            <textarea
              placeholder="Opis"
              rows={4}
              value={description}
              onChange={(e) => setDesc(e.target.value)}
            />

            <h4>Postojeće slike</h4>
            <div className="images">
              {photos.map((photo) => (
                <div key={photo} className="image-box">
                  <img src={photo} />
                  <label>
                    <input
                      type="checkbox"
                      onChange={() => toggleDelete(photo)}
                    />
                    Obriši
                  </label>
                </div>
              ))}
            </div>

            <h4>Dodaj nove slike</h4>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setNewImages(Array.from(e.target.files ?? []))
              }
            />

            <div className="card-button-wrapper">
              <button className="card-button primary" type="submit">
                Sačuvaj
              </button>
              <button
                className="card-button secondary"
                type="button"
                onClick={onClose}
              >
                Otkaži
              </button>
            </div>
          </form>
        </div>
      </StyledWrapper>
    </StyledOverlay>
  );
};


const StyledOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 20px; 
`;

const StyledWrapper = styled.div`
  .card {
    background: #fff;
    border-radius: 20px;
    padding: 40px;
    position: relative;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
    width: 95vw;
    max-width: 1200px;
    height:500px;
    max-height: 95vh;  
    overflow-y: auto;  
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top:50px;
    color:gray;
  }

  .card-heading {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 20px;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border-radius: 10px;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }

  textarea {
    resize: vertical;
  }

  h4 {
    margin: 10px 0 8px;
    font-size: 18px;
    font-weight: 600;
    color:black;
  }

  .images {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }

  .image-box {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .image-box img {
    width: 100%;
    height: 150px;  
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid #ddd;
  }

  .image-box label {
    font-size: 14px;
  }

  .card-button-wrapper {
    display: flex;
    gap: 15px;
    margin-top: 15px;
  }

  .card-button {
    flex: 1;
    height: 45px;
    border-radius: 12px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    font-size: 16px;
  }


  .primary {
    background: rgb(255, 73, 66);
    color: white;
  }

  .primary:hover {
    background: rgb(255, 100, 90);
  }

  .secondary {
    background: #ccc;
  }

  .secondary:hover {
    background: #bbb;
  }

  .exit-button {
    position: absolute;
    top: 20px;
    right: 20px;
    border: none;
    background: transparent;
    font-size: 28px;
    cursor: pointer;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    .grid {
      grid-template-columns: 1fr; 
    }

    .card {
      padding: 20px;
      width: 95vw;
      max-height: 90vh;
    }

    .image-box img {
      height: 120px;
    }
  }
`;


export default EditModal;
