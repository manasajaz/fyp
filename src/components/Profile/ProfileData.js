import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileData = () => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const token = localStorage.getItem("token"); // Get token from storage

    if (!token) {
      alert("You are not logged in.");
      navigate("/login");
      return;
    }

    try {
      await axios.delete("http://localhost:4600/api/auth/delete", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Account deleted successfully");
      localStorage.removeItem("token"); // Remove token from storage
      navigate("/register");
    } catch (error) {
      console.error("Deletion failed", error);
      alert("Failed to delete account");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Profile Data</h2>
        <p className="mb-4">This is where user profile data will be displayed.</p>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default ProfileData;
