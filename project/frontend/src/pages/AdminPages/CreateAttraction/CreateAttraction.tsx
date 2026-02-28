import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./CreateAttraction.css";
import { AppContext } from "../../../context/AppContext";
import BASE_URL from "../../../config/api";

const CreateAttraction = () => {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    longitude: string;
    latitude: string;
    category: string;
    files: File[];
  }>({
    name: "",
    description: "",
    longitude: "",
    latitude: "",
    category: "Islamic",
    files: [],
  });

  const [loading, setLoading] = useState(false);
  const { userId, userRole } = useContext(AppContext);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length > 5) {
        toast.error("Možete odabrati najviše 5 slika.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        files: selectedFiles,
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append("Name", formData.name);
    form.append("Description", formData.description);
    form.append("Longitude", formData.longitude);
    form.append("Latitude", formData.latitude);
    form.append("Category", formData.category);
    form.append("bucketName", "np.click");

    formData.files.forEach((file) => {
      form.append("files", file);
    });

    try {
      if (!userId) {
        toast.error("Došlo je do greške: korisnički ID nije pronađen.");
        return;
      }

      await axios.post(
        `${BASE_URL}/tourist_attractions/create/${userId}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Turistička atrakcija uspešno kreirana!");
      setFormData({
        name: "",
        description: "",
        longitude: "",
        latitude: "",
        category: "Islamic",
        files: [],
      });
      if (userRole === "Local_company") {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating attraction:", error);
      toast.error("Došlo je do greške prilikom kreiranja atrakcije.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-attraction-page">
      <h1>Kreiraj turističku atrakciju</h1>
      <form className="create-attraction-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Naziv</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Opis</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="longitude">Geografska dužina</label>
          <input
            type="text"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="latitude">Geografska širina</label>
          <input
            type="text"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Kategorija</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="islamic">Islamski spomenik</option>
            <option value="christian">Hrišćanski spomenik</option>
            <option value="natural">Spomenik prirode</option>
            <option value="hotel">Hotel</option>
            <option value="restaurants">Restoran</option>
            <option value="cafe">Kafić</option>
            <option value="historic">Istorijski spomenik</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="files">Slike</label>
          <input
            className="files"
            type="file"
            id="files"
            name="files"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            required
          />
          <p>Maksimalno 5 slika.</p>
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Kreiranje..." : "Kreiraj"}
        </button>
      </form>
    </div>
  );
};

export default CreateAttraction;
