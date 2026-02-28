import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import Loader from "../../../components/Loader/Loader";
import "./AllowUsers.css";
import BASE_URL from "../../../config/api";

type User = {
  id: string;
  userName: string;
  email: string;
  roles: string[];
  isApproved: boolean;
};

const AllowUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = `${BASE_URL}/users`;
  const approveUserUrl = `${BASE_URL}/account/approve-user`;
  const { token } = useContext(AppContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(apiBaseUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const filteredUsers = response.data.filter(
          (user: User) => !user.isApproved && user.roles[0] === "Local_company"
        );
        setUsers(filteredUsers);
        setFilteredUsers(filteredUsers); // Initially show all users
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const approveUser = async (userId: string) => {
    try {
      await axios.post(
        approveUserUrl,
        { userId, isApproved: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json-patch+json",
          },
        }
      );
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setFilteredUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to approve user");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter(
      (user) =>
        user.userName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  if (loading)
    return (
      <div className="loader-container">
        <Loader />
      </div>
    );

  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="allow-users-page">
      <h1>Korisnici na čekanju</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Pretraži korisnike po imenu ili emailu"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      {filteredUsers.length > 0 ? (
        <table className="users-table">
          <thead>
            <tr>
              <th>Korisničko ime</th>
              <th>Email</th>
              <th>Uloga</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>{user.roles[0]}</td>
                <td>
                  <button
                    className="approve-button"
                    onClick={() => approveUser(user.id)}
                  >
                    Dozvoli pristup
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-users-message">
          <p>Nema korisnika koji trenutno čekaju dozvolu.</p>
        </div>
      )}
    </div>
  );
};

export default AllowUsers;
