import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Card from "../../../components/Card/Card";
import "./AttractionsPage.css";
import Loader from "../../../components/Loader/Loader";
import { Review } from "../../../types/Attraction";
import BASE_URL from "../../../config/api";



type Attraction = {
  id: string;
  name: string;
  description: string;
  photos: Array<string>;
  reviews?: Review[]; // Reviews might be undefined
  averageRating?: number;
  createdOn: string; // For sorting by "Najnovije" and "Najstarije"
};

const AttractionsPage = () => {
  const { search } = useLocation();
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [sortedAttractions, setSortedAttractions] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState(""); // Keeps track of selected sorting order
  const [timeOrder, setTimeOrder] = useState(""); // Keeps track of time-based sorting
  const queryParams = new URLSearchParams(search);
  const category = queryParams.get("category");

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${BASE_URL}/tourist_attractions?Category=${category}`
        );
        const attractionsWithRatings = response.data.map(
          (attraction: Attraction) => {
            const reviews = attraction.reviews || []; // Handle undefined reviews
            const averageRating =
              reviews.length > 0
                ? reviews.reduce((sum, review) => sum + review.rating, 0) /
                  reviews.length
                : 0;
            return { ...attraction, averageRating };
          }
        );
        setAttractions(attractionsWithRatings);
        setSortedAttractions(attractionsWithRatings);
      } catch (error) {
        console.error("Error fetching attractions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttractions();
  }, [category]);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const order = event.target.value;
    setSortOrder(order);

    let sorted = [...attractions];
    if (order === "best") {
      sorted = sorted.sort(
        (a, b) => (b.averageRating || 0) - (a.averageRating || 0)
      );
    } else if (order === "worst") {
      sorted = sorted.sort(
        (a, b) => (a.averageRating || 0) - (b.averageRating || 0)
      );
    }
    setSortedAttractions(sorted);
  };

  const handleTimeSortChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const order = event.target.value;
    setTimeOrder(order);

    let sorted = [...attractions];
    if (order === "najnovije") {
      sorted = sorted.reverse();
    } else if (order === "najstarije") {
      sorted = attractions;
    }
    setSortedAttractions(sorted);
  };

  if (isLoading) {
    return (
      <div className="loader-container">
        <Loader />
      </div>
    );
  }
  if (sortedAttractions.length === 0 || !sortedAttractions) {
    return (
      <div className="content">
        <h2>Nema postavljenih turističkih atrakcija za ovu kategoriju.</h2>
      </div>
    );
  }
  return (
    <div>
      <div className="sort-container">
        <label htmlFor="sort">Sortiraj po rejtingu:</label>
        <select id="sort" value={sortOrder} onChange={handleSortChange}>
          <option value="">Bez sortiranja</option>
          <option value="best">Najbolji rejting</option>
          <option value="worst">Najlošiji rejting</option>
        </select>
        <label htmlFor="timeSort">Sortiraj po vremenu:</label>
        <select id="timeSort" value={timeOrder} onChange={handleTimeSortChange}>
          <option value="">Bez sortiranja</option>
          <option value="najnovije">Najnovije</option>
          <option value="najstarije">Najstarije</option>
        </select>
      </div>
      <div className="attractions_container">
        {sortedAttractions.map((attraction) => {
          const firstPhoto = attraction.photos[0];
          return (
            <Card
              key={attraction.id}
              id={attraction.id}
              image={firstPhoto}
              title={attraction.name}
              description={attraction.description.slice(0, 60).concat("...")}
              show={false}
              extraInfo={`Prosečan rejting: ${
                attraction.averageRating && attraction.averageRating > 0
                  ? attraction.averageRating.toFixed(1)
                  : "Nema recenzija"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AttractionsPage;
