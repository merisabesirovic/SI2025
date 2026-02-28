import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./AdminHomePage.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import { AppContext } from "../../../context/AppContext";
import Modal from "../../../components/Modal/Modal";
import Loader from "../../../components/Loader/Loader";
import BASE_URL from "../../../config/api";

type User = {
  id: string;
  userName: string;
  email: string;
  roles: string[];
};

const AdminHomePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editUserData, setEditUserData] = useState<Partial<User>>({
    roles: [],
  });
  const [error, setError] = useState<string | null>(null);
  const { token } = useContext(AppContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 5;

  const apiBaseUrl = `${BASE_URL}/users`;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(apiBaseUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    const filtered = users.filter((user) => {
      const term = searchTerm.toLowerCase();
      return (
        user.userName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.roles.some((role) => role.toLowerCase().includes(term))
      );
    });
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await axios.delete(`${apiBaseUrl}/${userToDelete.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const updatedUsers = users.filter(
          (user) => user.id !== userToDelete.id
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setUserToDelete(null);
        setShowDeleteModal(false);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditUserId(user.id);
    setEditUserData({
      userName: user.userName,
      email: user.email,
      roles: [...user.roles],
    });
  };

  const handleUpdate = async () => {
    if (!editUserData.roles?.length) {
      setError("Role cannot be empty.");
      return;
    }

    try {
      if (editUserId) {
        const response = await axios.put(
          `${apiBaseUrl}/${editUserId}/roles`,
          { roles: editUserData.roles },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json-patch+json",
            },
          }
        );

        const updatedUsers = users.map((user) =>
          user.id === editUserId
            ? { ...user, roles: editUserData.roles || [] }
            : user
        );
        setUsers(updatedUsers);

        const updatedFilteredUsers = filteredUsers.map((user) =>
          user.id === editUserId
            ? { ...user, roles: editUserData.roles || [] }
            : user
        );
        setFilteredUsers(updatedFilteredUsers);

        setEditUserId(null);
        setEditUserData({ roles: [] });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update user roles");
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading)
    return (
      <div>
        <Loader />
      </div>
    );
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="admin-homepage">
      <h1>Svi korisnici</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Pretraži korisničko ime, email, ulogu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Korisničko ime</th>
            <th>Email</th>
            <th>Uloga</th>
            <th>Uredi</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.userName}</td>
              <td>{user.email}</td>
              <td>{user.roles[0]}</td>
              <td>
                <button onClick={() => handleEdit(user)} className="edit-btn">
                  <FaEdit size={18} color="white" /> Izmeni ulogu
                </button>
                <button
                  onClick={() => openDeleteModal(user)}
                  className="delete-btn"
                >
                  <FaTrash size={18} color="white" /> Izbriši
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={currentPage === number ? "active" : ""}
            >
              {number}
            </button>
          )
        )}
      </div>

      {editUserId && (
        <div className="edit-user-modal">
          <h2>Promenite ulogu korisnika</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
          >
            <p className="labels">Korisničko ime: </p>
            <p>{editUserData.userName}</p>

            <p className="labels">Email: </p>
            <p>{editUserData.email}</p>

            <label>
              <p className="labels">Uloga: </p>

              <select
                className="select-role"
                value={editUserData.roles?.[0] || ""}
                onChange={(e) => {
                  console.log(editUserData);
                  setEditUserData({
                    ...editUserData,
                    roles: [e.target.value],
                  });
                }}
              >
                <option value="" disabled>
                  Izaberite ulogu
                </option>
                <option value="Local_company">Local Company</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </label>

            <div className="modal-actions">
              <button type="submit">Sačuvaj</button>
              <button
                type="button"
                onClick={() => {
                  setEditUserId(null);
                  setEditUserData({ roles: [] }); // Reset form
                }}
              >
                Odustani
              </button>
            </div>
          </form>
        </div>
      )}

      {showDeleteModal && userToDelete && (
        <Modal
          title="Potvrdite brisanje"
          description={`Da li ste sigurni da želite da izbrišete korisnika "${userToDelete.userName}"?`}
          actionLabel="Izbriši"
          onAction={confirmDelete}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default AdminHomePage;
