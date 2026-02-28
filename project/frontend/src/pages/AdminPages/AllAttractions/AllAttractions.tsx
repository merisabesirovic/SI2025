import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Card from "../../../components/Card/Card";
import Loader from "../../../components/Loader/Loader";
import { Attraction } from "../../../types/Attraction";
import BASE_URL from "../../../config/api";


const AllAttractions: React.FC = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [hasNextPage, setHasNextPage] = useState(true);

  const fetchAttractions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/tourist_attractions`,
        {
          params: {
            Category: category || undefined,
            PageNumber: pageNumber,
            PageSize: pageSize,
            Search: debouncedSearch || undefined,
          },
        }
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
      setFilteredAttractions(attractionsWithRatings);
      setHasNextPage(attractionsWithRatings.length === pageSize);
    } catch (error) {
      console.error("Error fetching attractions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttractions();
  }, [pageNumber, pageSize, category, debouncedSearch]);

  useEffect(() => {
    const filtered = attractions.filter((attraction) => {
      const term = debouncedSearch.toLowerCase();
      return (
        attraction.name.toLowerCase().includes(term) ||
        attraction.description.toLowerCase().includes(term) ||
        attraction.category.toLowerCase().includes(term)
      );
    });
    setFilteredAttractions(filtered);
  }, [debouncedSearch, attractions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setPageNumber(1); // Reset to the first page when changing category
  };

  const handlePageChange = (direction: "next" | "prev") => {
    if (direction === "next" && hasNextPage) {
      setPageNumber((prev) => prev + 1);
    } else if (direction === "prev" && pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
    }
  };

  const handleUpdateAttraction = (updatedAttraction: Attraction) => {
    setAttractions((prevAttractions) =>
      prevAttractions.map((attraction) =>
        attraction.id === updatedAttraction.id ? updatedAttraction : attraction
      )
    );
  };

  return (
    <Container>
      <Controls>
        <input
          type="text"
          placeholder="Pretraži..."
          value={search}
          onChange={handleSearch}
        />
        <select value={category} onChange={handleCategoryChange}>
          <option value="">Svi</option>
          <option value="hotel">Hoteli</option>
          <option value="historic">Istorijski spomenici</option>
          <option value="islamic">Islamski spomenici</option>
          <option value="christian">Hrišćanski spomenici</option>
          <option value="cafe">Kafić</option>
          <option value="restaurants">Restorani</option>
          <option value="natural">Prirodni spomenici</option>
        </select>
        <Pagination>
          <button
            onClick={() => handlePageChange("prev")}
            disabled={pageNumber === 1}
          >
            Prethodna
          </button>
          <span>Stanica {pageNumber}</span>
          <button
            onClick={() => handlePageChange("next")}
            disabled={!hasNextPage}
          >
            Sledeća
          </button>
        </Pagination>
      </Controls>
      <CardsContainer>
        {loading ? (
          <Loader />
        ) : filteredAttractions.length > 0 ? (
          filteredAttractions.map((attraction) => (
            <Card
              key={attraction.id}
              id={attraction.id}
              image={attraction.photos[0]}
              title={attraction.name}
              description={attraction.description.slice(0, 100).concat("...")}
              show={true}
              extraInfo={`Prosečan rejting: ${
                attraction.averageRating && attraction.averageRating > 0
                  ? attraction.averageRating.toFixed(1)
                  : "Nema recenzija"
              }`}
              onUpdate={handleUpdateAttraction}
            />
          ))
        ) : (
          <p>Nije pronađena nijedna turistička atrakcija.</p>
        )}
      </CardsContainer>
    </Container>
  );
};

export default AllAttractions;

const Container = styled.div`
  padding: 20px;
  margin-top: 30px;
`;
const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;

  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  select {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    input,
    select {
      width: 100%;
    }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;

  button {
    padding: 8px 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f0f0f0;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  span {
    margin-top: 10px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 10px;
    justify-content: center; /* Ensures it aligns properly in the center */
  }
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Stack cards vertically on small screens */
  }
`;
