import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import "./LocalCompanyStatsPage.css";
import BASE_URL from "../../../config/api";

interface LatestReview {
  rating: number;
  comment: string;
  userName: string;
  date: string;
}

interface AttractionStats {
  id: number;
  name: string;
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: Record<number, number>;
  totalFavorites: number;
  totalViews: number;
  latestReviews: LatestReview[];
}

interface MyAttractionResponse {
  hasCreatedAttraction: boolean;
  attraction: {
    id: number;
    name: string;
  } | null;
}

const LocalCompanyStatsPage = () => {
  const { token, userId } = useContext(AppContext);
  const authToken = token ?? localStorage.getItem("token");
  const decodeJwt = (jwt: string | null): Record<string, any> | null => {
    if (!jwt) return null;
    try {
      const raw = jwt.startsWith("Bearer ") ? jwt.slice(7) : jwt;
      const payload = raw.split(".")[1];
      if (!payload) return null;
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  };
  const tokenPayload = decodeJwt(authToken);
  const claimUserId =
    tokenPayload?.nameid ??
    tokenPayload?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ??
    null;
  const authUserId = userId ?? localStorage.getItem("id") ?? claimUserId;
  const [stats, setStats] = useState<AttractionStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAttraction, setHasAttraction] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!authToken || !authUserId) {
        setLoading(false);
        setError("Niste prijavljeni.");
        return;
      }

      try {
        const attractionResponse = await axios.get<MyAttractionResponse>(
          `${BASE_URL}/tourist_attractions/myAttraction/${authUserId}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        if (!attractionResponse.data.hasCreatedAttraction || !attractionResponse.data.attraction) {
          setHasAttraction(false);
          setLoading(false);
          return;
        }

        const attractionId = attractionResponse.data.attraction.id;
        const statsResponse = await axios.get<AttractionStats>(
          `${BASE_URL}/attractions/stats/${attractionId}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        setStats(statsResponse.data);
      } catch (err) {
        setError("Neuspešno učitavanje statistike.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [authToken, authUserId]);

  if (loading) {
    return (
      <div className="stats-page">
        <div className="stats-loading">Učitavanje statistike...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-page">
        <div className="stats-error">{error}</div>
      </div>
    );
  }

  if (!hasAttraction) {
    return (
      <div className="stats-page">
        <div className="stats-empty">
          Nemate kreiranu turističku atrakciju. Kreirajte je da biste videli statistiku.
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const breakdownOrder = [5, 4, 3, 2, 1];

  return (
    <div className="stats-page">
      <div className="stats-header">
        <h1>Statistika za: {stats.name}</h1>
        <p>Pregled najvažnijih pokazatelja vaše atrakcije.</p>
      </div>

      <div className="stats-cards">
        <div className="stats-card">
          <div className="stats-label">Ukupno recenzija</div>
          <div className="stats-value">💬 {stats.totalReviews}</div>
        </div>
        <div className="stats-card">
          <div className="stats-label">Prosečna ocena</div>
          <div className="stats-value">⭐ {stats.averageRating}</div>
        </div>
        <div className="stats-card">
          <div className="stats-label">Ukupno korisnika koji su dodali u listu omiljenih</div>
          <div className="stats-value">❤️ {stats.totalFavorites}</div>
        </div>
        <div className="stats-card">
          <div className="stats-label">Ukupno pregleda</div>
          <div className="stats-value">👀 {stats.totalViews}</div>
        </div>
      </div>

      <div className="stats-grid">
        <section className="stats-section">
          <h2>Ocene po zvezdicama</h2>
          <div className="rating-breakdown">
            {breakdownOrder.map((star) => (
              <div key={star} className="rating-row">
                <span className="rating-stars">{"⭐".repeat(star)}</span>
                <span className="rating-count">{stats.ratingBreakdown[star] || 0}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="stats-section">
          <h2>Najnovije recenzije</h2>
          <div className="latest-reviews">
            {stats.latestReviews.length === 0 ? (
              <div className="stats-empty">Nema recenzija za prikaz.</div>
            ) : (
              stats.latestReviews.map((review, index) => (
                <div key={`${review.userName}-${index}`} className="review-item">
                  <div className="review-header">
                    <span className="review-user">🧑 {review.userName}</span>
                    <span className="review-rating">
                      {"⭐".repeat(Math.max(1, review.rating))}
                    </span>
                  </div>
                  <div className="review-comment">{review.comment}</div>
                  <div className="review-date">
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LocalCompanyStatsPage;
