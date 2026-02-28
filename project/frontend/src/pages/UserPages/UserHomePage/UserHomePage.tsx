import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import PortfolioFavorites from "../../../components/UserPageComponents/PortfolioFavorites/PortfolioFavorites";
import ProfileCard from "../../../components/UserPageComponents/ProfileCard/ProfileCard";
import Loader from "../../../components/Loader/Loader";
import "./UserHomePage.css";
import { useNavigate } from "react-router-dom";
import { FaRoute, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import BASE_URL from "../../../config/api";

interface TripPlanItem {
  id: number;
  name: string;
  category: string;
  latitude: string;
  longitude: string;
  type: "favorite" | "recommendation";
}

interface TripPlanGroup {
  favorite: TripPlanItem;
  recommendations: TripPlanItem[];
}

const UserHomePage = () => {
  const { token, userId } = useContext(AppContext);
  const [userInfo, setUserInfo] = useState({
    userName: "",
    email: "",
    isApproved: false,
    roles: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tripPlan, setTripPlan] = useState<TripPlanItem[]>([]);
  const [tripPlanError, setTripPlanError] = useState<string | null>(null);
  const [tripPlanLoading, setTripPlanLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserInfo(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch user information.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId, token]);

  useEffect(() => {
    const fetchTripPlan = async () => {
      if (!userId || !token) return;
      setTripPlanLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/users/${userId}/trip-plan`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTripPlan(response.data);
        setTripPlanError(null);
      } catch (err) {
        setTripPlanError("Failed to fetch trip plan.");
      } finally {
        setTripPlanLoading(false);
      }
    };

    fetchTripPlan();
  }, [userId, token]);

  const handleUpdateUserName = async (newUserName: string) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/users/${userId}`,
        {
          userName: newUserName,
          email: userInfo.email,
          isApproved: userInfo.isApproved,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserInfo((prev) => ({ ...prev, userName: response.data.userName }));
      setError(null);
    } catch (err) {
      setError("Failed to update username.");
    }
  };

  const buildTripPlanGroups = (items: TripPlanItem[]): TripPlanGroup[] => {
    const groups: TripPlanGroup[] = [];
    let currentGroup: TripPlanGroup | null = null;

    items.forEach((item) => {
      if (item.type === "favorite") {
        currentGroup = { favorite: item, recommendations: [] };
        groups.push(currentGroup);
      } else if (currentGroup) {
        currentGroup.recommendations.push(item);
      }
    });

    return groups;
  };

  const totalRecommendations = tripPlan.filter(
    (item) => item.type === "recommendation"
  ).length;

  const haversineDistanceKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const toRadians = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.asin(Math.min(1, Math.sqrt(a)));
    return R * c;
  };

  const getDistanceLabel = (from: TripPlanItem, to: TripPlanItem) => {
    const lat1 = parseFloat(from.latitude);
    const lon1 = parseFloat(from.longitude);
    const lat2 = parseFloat(to.latitude);
    const lon2 = parseFloat(to.longitude);
    if (
      Number.isNaN(lat1) ||
      Number.isNaN(lon1) ||
      Number.isNaN(lat2) ||
      Number.isNaN(lon2)
    ) {
      return null;
    }
    const distance = haversineDistanceKm(lat1, lon1, lat2, lon2);
    return `${distance.toFixed(2)} km`;
  };

  const goToAttraction = (id: number) => {
    navigate(`/attractions/${id}`);
  };

  if (loading) {
    return (
      <div className="loader-container">
        <Loader />
      </div>
    );
  }

  return (
    <div className="user-home-wrapper">
      <div className="user-home-container">
        {error && <div className="error-banner">{error}</div>}

        {/* Main Content Area */}
        <div className="main-content">
          {userInfo.roles[0] !== "Local_company" ? (
            <>
              {/* Trip Planner Section */}
              <section className="trip-planner-section">
                <div className="section-header-modern">
                  <div className="header-content">
                    <FaRoute className="header-icon" />
                    <div>
                      <h2>Planer Putovanja</h2>
                      <p>Personalizovani plan baziran na vašim omiljenim mestima</p>
                    </div>
                  </div>
                </div>
                <div className="trip-note">
                  Pogledajte naše preporuke za otkrivanje čari Novog Pazara.
                   Dodajte još omiljenih mesta za više ideja.
                </div>

                {tripPlanError && (
                  <div className="trip-error-message">
                    <span>⚠️</span> {tripPlanError}
                  </div>
                )}

                {tripPlanLoading ? (
                  <div className="trip-loading">
                    <div className="loading-spinner"></div>
                    <p>Učitavanje plana putovanja...</p>
                  </div>
                ) : tripPlan.length === 0 ? (
                  <div className="trip-empty-state">
                    <FaMapMarkerAlt className="empty-icon" />
                    <h3>Nema planiranih putovanja</h3>
                    <p>Dodajte omiljene atrakcije da kreirate vaš plan putovanja</p>
                  </div>
                ) : (
                  <div className="trip-groups-container">
                    {buildTripPlanGroups(tripPlan).map((group, groupIndex) => (
                      <div
                        className="trip-group-card"
                        key={`favorite-${group.favorite.id}`}
                      >
                        {/* Favorite Card */}
                        <div className="favorite-destination">
                          <div className="destination-badge">
                            <FaStar className="badge-icon" />
                            <span>Omiljeno</span>
                          </div>
                          <h3 className="destination-name">
                            {group.favorite.name}
                          </h3>
                          <span className="destination-category">
                            {group.favorite.category}
                          </span>
                        </div>

                        {/* Recommendations */}
                        {group.recommendations.length > 0 && (
                          <div className="recommendations-grid">
                            {group.recommendations.map((rec) => {
                              const distance = getDistanceLabel(
                                group.favorite,
                                rec
                              );
                              return (
                                <div
                                  className="recommendation-card"
                                  key={`rec-${group.favorite.id}-${rec.id}`}
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => goToAttraction(rec.id)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      goToAttraction(rec.id);
                                    }
                                  }}
                                >
                                  <div className="rec-header">
                                    <h4>{rec.name}</h4>
                                    <span className="rec-badge">
                                      Preporučeno
                                    </span>
                                  </div>
                                  <div className="rec-details">
                                    <span className="rec-category">
                                      {rec.category}
                                    </span>
                                    {distance && (
                                      <span className="rec-distance">
                                        <FaMapMarkerAlt /> {distance}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {group.recommendations.length === 0 &&
                          totalRecommendations === 0 && (
                            <div className="no-recommendations">
                              <p>Trenutno nema preporuka za ovu destinaciju</p>
                            </div>
                          )}

                        {group.recommendations.length === 0 &&
                          totalRecommendations > 0 && (
                            <div className="no-recommendations">
                              <p>Nema dodatnih preporuka za ovu destinaciju</p>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Portfolio Section */}
              <section className="portfolio-section">
                <PortfolioFavorites />
              </section>
            </>
          ) : (
            <section className="company-dashboard-modern">
              <div className="welcome-card">
                <div className="welcome-icon">🏢</div>
                <h2>Dobrodošli u vaš poslovni profil!</h2>
                <p>
                  Ovde možete upravljati svim informacijama vezanim za vašu
                  kompaniju.
                </p>
                <div className="info-box">
                  <p>
                    💡 Klikom na "Pregled stranice" možete urediti svoju
                    stranicu i postati prava turistička atrakcija!
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar - Profile Card */}
        <aside className="sidebar">
          <div className="profile-section">
            <div className="profile-header">
              <h2>Vaš Profil</h2>
            </div>
            <ProfileCard
              userInfo={userInfo}
              onUpdateUserName={handleUpdateUserName}
            />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default UserHomePage;
