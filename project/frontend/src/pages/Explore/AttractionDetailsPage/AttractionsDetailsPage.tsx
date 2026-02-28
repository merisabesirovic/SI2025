import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./AttractionsDetailsPage.css";
import { motion } from "framer-motion";
import { FaMapLocationDot, FaStar } from "react-icons/fa6";
import Reviews from "../Reviews/Reviews";
import { FaPencilAlt } from "react-icons/fa";

import Loader from "../../../components/Loader/Loader";
import AddToFavorites from "../AddToFavorites/AddToFavorites";
import EditModal from "../../../components/Modal/EditModal";
import { AppContext } from "../../../context/AppContext";
import { Attraction } from "../../../types/Attraction";
import BASE_URL from "../../../config/api";

interface AttractionDetailsPageProps {
  propAttraction?: Attraction | null;
  attractionId?: string;
}

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const AttractionDetailsPage: React.FC<AttractionDetailsPageProps> = ({
  propAttraction,
}) => {
  const { id } = useParams<{ id: string }>();
  const [attraction, setAttraction] = useState<Attraction | null>(
    propAttraction ?? null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDesc] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [category, setCategory] = useState("");
  const { userRole } = useContext(AppContext);
  const adminOrCompany = userRole === "Local_company" || userRole === "Admin";

  useEffect(() => {
    if (!propAttraction) {
      const fetchAttractionDetails = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(
            `${BASE_URL}/tourist_attractions/${id}`
          );
          setAttraction(response.data);
        } catch (error) {
          console.error("Error fetching attraction details:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAttractionDetails();
    } else {
      setIsLoading(false);
    }
  }, [id, propAttraction]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error getting user location:", error.message);
      }
    );
  }, []);

  const openEditModal = () => {
    if (attraction) {
      setName(attraction.name);
      setDesc(attraction.description);
      setLongitude(attraction.longitude);
      setLatitude(attraction.latitude);
      setCategory(attraction.category);
      setIsModalOpen(true);
    }
  };

  const calculateAverageRating = (reviews: Array<{ rating: number }>) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  const handleUpdateAttraction = async (
    imagesToDelete: string[],
    newImages: File[]
  ) => {
    try {
      console.log("tr");
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("longitude", longitude);
      formData.append("latitude", latitude);
      formData.append("category", category);

      imagesToDelete.forEach((url) => formData.append("ImagesToDelete", url));

      newImages.forEach((file) => formData.append("NewImages", file));

      const response = await axios.put(
        `${BASE_URL}/tourist_attractions/${attraction?.id}`,
        formData
      );

      setAttraction(response.data);
      setIsModalOpen(false);
      toast.success("Atrakcija uspešno ažurirana!");
    } catch (error) {
      console.error("Error updating attraction:", error);
      toast.error("Došlo je do greške pri ažuriranju atrakcije.");
    }
  };

  if (isLoading) {
    return (
      <div className="loader-container">
        <Loader />
      </div>
    );
  }

  if (!attraction) {
    return <div>Nema dodatnih informacija o ovoj stranici.</div>;
  }

  const photosArray = attraction.photos;
  const averageRating = calculateAverageRating(attraction.reviews ?? []);

  return (
    <div className="attraction-details-wrapper">
      {/* Hero Section */}
      <motion.div
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-image-container">
          <img
            src={photosArray[0]}
            alt={attraction.name}
            className="hero-image"
          />
          <div className="hero-overlay"></div>
        </div>

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="hero-title">{attraction.name}</h1>
          
          {averageRating > 0 && (
            <div className="hero-rating">
              <FaStar className="star-icon" />
              <span className="rating-value">{averageRating.toFixed(1)}</span>
              <span className="rating-count">
                ({attraction.reviews?.length || 0} recenzija)
              </span>
            </div>
          )}

          {adminOrCompany && (
            <button onClick={openEditModal} className="edit-button-hero">
              <FaPencilAlt /> Uredi Atrakciju
            </button>
          )}
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="content-container">
        {/* About Section */}
        <motion.section
          className="about-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="section-header">
            <h2 className="section-title">O Atrakciji</h2>
            <div className="title-underline"></div>
          </div>
          <p className="description-text">{attraction.description}</p>
        </motion.section>

        {/* Gallery Section */}
        <motion.section
          className="gallery-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="section-header">
            <h2 className="section-title">Galerija</h2>
            <div className="title-underline"></div>
          </div>

          <div className="carousel-wrapper">
            <Carousel
              swipeable={true}
              draggable={true}
              showDots={true}
              responsive={responsive}
              ssr={true}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={3000}
              keyBoardControl={true}
              customTransition="transform 500ms ease-in-out"
              transitionDuration={500}
              containerClass="carousel-container"
              dotListClass="custom-dot-list"
              itemClass="carousel-item-padding"
            >
              {photosArray.map((photo, index) => (
                <div key={index} className="gallery-item">
                  <img src={photo} alt={`${attraction.name} ${index + 1}`} />
                </div>
              ))}
            </Carousel>
          </div>
        </motion.section>

        {/* Location Section */}
        <motion.section
          className="location-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="section-header">
            <h2 className="section-title">Lokacija</h2>
            <div className="title-underline"></div>
          </div>

          <div className="map-container">
            <iframe
              className="map-iframe"
              src={`https://maps.google.com/maps?&hl=en&q=${attraction.longitude},${attraction.latitude}&t=h&z=12&ie=UTF8&iwloc=near&output=embed`}
              title="Google Map"
              loading="lazy"
            ></iframe>

            <a
              href={`https://www.google.com/maps/dir/${location.lat},${location.lng}/${attraction.longitude},${attraction.latitude}/?entry=ttu`}
              target="_blank"
              rel="noopener noreferrer"
              className="directions-button"
            >
              <FaMapLocationDot className="button-icon" />
              <span>Prikaži Putanju</span>
            </a>
          </div>
        </motion.section>

        {/* Reviews Section */}
        <motion.section
          className="reviews-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Reviews
            attractionId={id!}
            initialReviews={attraction.reviews}
            showForm={adminOrCompany}
          />
        </motion.section>

        {/* Add to Favorites */}
        {!adminOrCompany && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <AddToFavorites attractionName={attraction.name} />
          </motion.div>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && attraction && (
        <EditModal
          title="Izmena atrakcije"
          name={name}
          description={description}
          longitude={longitude}
          latitude={latitude}
          category={category}
          photos={attraction.photos}
          onSave={handleUpdateAttraction}
          onClose={() => setIsModalOpen(false)}
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

export default AttractionDetailsPage;
