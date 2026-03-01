import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import { CgSmileSad, CgSmileNeutral } from "react-icons/cg";
import { BiSmile } from "react-icons/bi";
import { FaRegFaceSmileBeam } from "react-icons/fa6";
import { PiSmileyBlankBold } from "react-icons/pi";
import ReviewCard from "../../../components/ReviewCard/ReviewCard";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Modal from "../../../components/Modal/Modal";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";
import { Review } from "../../../types/Attraction";
import BASE_URL from "../../../config/api";

const MAX_COMMENT_LENGTH = 150;
const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

const customIcons: Record<number, { icon: JSX.Element; label: string }> = {
  1: {
    icon: <CgSmileSad color="red" size={40} />,
    label: "Very Dissatisfied",
  },
  2: {
    icon: <CgSmileNeutral color="orange" size={40} />,
    label: "Dissatisfied",
  },
  3: {
    icon: <PiSmileyBlankBold color="yellow" size={40} />,
    label: "Neutral",
  },
  4: {
    icon: <BiSmile color="green" size={40} />,
    label: "Satisfied",
  },
  5: {
    icon: <FaRegFaceSmileBeam color="green" size={35} />,
    label: "Very Satisfied",
  },
};


type ReviewsProps = {
  attractionId: string;
  initialReviews?: Review[];
  showForm?: boolean;
};

const Reviews: React.FC<ReviewsProps> = ({
  attractionId,
  initialReviews = [],
  showForm,
}) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [alreadyReviewed, setAlreadyReviewed] = useState<boolean>(false);
  const { token, userRole } = useContext(AppContext);
  const username = localStorage.getItem("username");
  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > MAX_COMMENT_LENGTH) {
      toast.warning(
        `Maksimalna dužina komentara je ${MAX_COMMENT_LENGTH} karaktera!`
      );
      return;
    }
    setNewReview((prev) => ({ ...prev, comment: value }));
  };

  useEffect(() => {
    if (!username) return;
    const hasReview = reviews.some(
      (review) => review.createdBy === username
    );
    setAlreadyReviewed(hasReview);
  }, [reviews, username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (alreadyReviewed) {
      toast.info("Već ste poslali recenziju za ovu atrakciju.");
      return;
    }
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/comment/${attractionId}`,
        newReview
      );
      const savedReview = response.data;
      setNewReview({ rating: 0, comment: "" });
      setReviews((prevReviews) => [
        ...prevReviews,
        {
          ...savedReview,
          createdOn: new Date().toISOString(),
          createdBy: username || "You",
        },
      ]);
      setAlreadyReviewed(true);
      toast.success("Recenzija je uspešno sačuvana.");
    } catch (error: any) {
      console.error("Error posting review:", error);
      const message =
        error?.response?.data || "Ne možete poslati još jednu recenziju.";
      toast.error(message);
      if (error?.response?.status === 400 || error?.response?.status === 409) {
        setAlreadyReviewed(true);
      }
    }
  };

  const handleDeleteReview = async (
    reviewId: number,
    reviewCreatedBy: string
  ) => {
    if (
      userRole === "admin" ||
      userRole === "local_company" ||
      username === reviewCreatedBy
    ) {
      try {
        await axiosInstance.delete(
          `${BASE_URL}/comment/${reviewId}`
        );
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.id !== reviewId)
        );
        closeModal();
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    } else {
      alert("You do not have permission to delete this review.");
    }
  };

  const openModal = (reviewId: number) => {
    setSelectedReviewId(reviewId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReviewId(null);
  };

  return (
    <StyledWrapper>
      <div className="reviews-list">
        <h2>Recenzije</h2>
        <Carousel
          swipeable={true}
          showDots={true}
          responsive={responsive}
          ssr={true}
          infinite={true}
          keyBoardControl={true}
          containerClass="carousel-container"
          itemClass="carousel-item-padding-40-px"
        >
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="review-card-wrapper">
                <ReviewCard
                  rating={review.rating}
                  title={`Autor: ${review.createdBy}`}
                  content={review.comment}
                  date={new Date(review.createdOn).toLocaleDateString()}
                />
                {(showForm || username === review.createdBy) && (
                  <button
                    className="submit-btn"
                    onClick={() => openModal(review.id)}
                  >
                    Izbriši recenziju
                  </button>
                )}
              </div>
            ))
          ) : (
            <div
              className="empty-reviews">
              <p style={{ textAlign: "center" }}>
                Nema recenzija za ovu stranicu.
              </p>
            </div>
          )}
        </Carousel>
      </div>

      {!showForm && (
        <form className="form" onSubmit={handleSubmit}>
          <h2 className="form-title">Ostavite recenziju</h2>
          {username ? (
            <>
              <div className="rating-container">
                <p className="rating-label">Ocenite svoje iskustvo:</p>
                <Rating
                  name="rating"
                  value={newReview.rating}
                  disabled={alreadyReviewed}
                  onChange={(e, value) =>
                    setNewReview({ ...newReview, rating: value || 0 })
                  }
                  IconContainerComponent={({ value }) => {
                    const isSelected = value === newReview.rating;
                    return (
                      <span
                        style={{
                          color: isSelected ? "inherit" : "gray",
                          opacity: isSelected ? 1 : 0.5,
                          transform: isSelected ? "scale(1.2)" : "scale(1)",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {customIcons[value]?.icon || <span />}
                      </span>
                    );
                  }}
                  getLabelText={(value) => customIcons[value]?.label || ""}
                />
              </div>
              <textarea
                placeholder="Opišite svoje iskustvo ovde..."
                value={newReview.comment}
                onChange={handleCommentChange}
                disabled={alreadyReviewed}
                required
              ></textarea>
              <p className="char-counter">
                {newReview.comment.length}/{MAX_COMMENT_LENGTH}
              </p>
              {alreadyReviewed && (
                <p className="already-reviewed">
                  Već ste poslali recenziju za ovu atrakciju.
                </p>
              )}
              <button type="submit" className="submit" disabled={alreadyReviewed}>
                Sačuvaj
              </button>
            </>
          ) : (
            <div className="login-prompt">
              <p>Morate se prijaviti da biste ostavili recenziju.</p>
            </div>
          )}
        </form>
      )}

      {isModalOpen && selectedReviewId !== null && (
        <Modal
          title="Potvrdite brisanje"
          description="Da li ste sigurni da želite da izbrišete recenziju?"
          actionLabel="Izbriši"
          onAction={() =>
            handleDeleteReview(
              selectedReviewId,
              reviews.find((review) => review.id === selectedReviewId)
                ?.createdBy || ""
            )
          }
          onClose={closeModal}
        />
      )}
    </StyledWrapper>
  );
};

const StyledWrapper = styled("div")`
  font-family: "Figtree", sans-serif;
  width: 100%;
  padding: 2rem;
  box-sizing: border-box;
  margin-top: 30px;

  .form {
    max-width: 700px;
    margin: 0 auto 2rem;
    padding: 2rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .reviews-list {
    max-width: 900px;
    margin: 0 auto;
  }
  .form textarea {
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
    max-width: 200px;
    border-radius: 0.5rem;
    text-transform: uppercase;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s ease;
    margin: 10px;
  }
  .rating-label {
    padding: 20px;
  }
  .submit-btn {
    padding: 0.75rem;
    background-color: #e43b39;
    color: #ffffff;

    font-size: 14px;
    font-weight: 500;
    width: 100%;
    max-width: 150px;
    border-radius: 0.5rem;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s ease;
  }
  .submit:hover {
    background-color: #c2312f;
  }
  .form-title {
    margin: 20px;
    color: #2e2e2d;
  }

  .review-card-wrapper {
    display: flex;
    flex-direction: column;
    width: fit-content;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
  }

  .empty-reviews {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    width: 900px;

  }

  .login-prompt {
    padding: 10px;
    background-color: #f1f1f1;
    text-align: center;
  }
  .already-reviewed {
    color: #e43b39;
    font-weight: 600;
    margin: 0 0 8px 0;
  }
    @media (max-width: 920px) {
    .empty-reviews{
    width:350px;
    }

`;
export default Reviews;
