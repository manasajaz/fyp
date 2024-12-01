import React, { useState } from "react";
import loginImg from "../../assets/AuthImages/blog.jpg";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext/AuthContext';

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import axios from "axios";

//toastify

import { Slide, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    showPassword: false,
  });

  const [loading, setLoading] = useState(false); // Added for button state
  const navigate = useNavigate();



  const handleChange = (e) => {                   // getting user input
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
    console.log({ name: value });
  };

  const EyeButtonVisibility = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword })
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Disable button
    try {
      const response = await axios.post("http://localhost:4600/api/auth/register", formData);
      toast.success("Registration Successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Re-enable button
    }
  };

  return (
    <div className="grid grid-cols-10 gap-4 p-5 bg-indigo-50 min-h-screen">
      {/* Left-side image */}
      <div className="col-span-4">
        <img className="w-full object-cover h-full" src={loginImg} alt="Register" />
      </div>

      {/* Right-side form */}
      <div className="col-span-6 bg-white p-5 rounded shadow flex flex-col justify-start">
        <h2 className="text-4xl mb-8 mt-12 font-semibold">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={formData.showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full border rounded-md p-2"
              />
              <span className="absolute right-3 top-3 cursor-pointer" onClick={EyeButtonVisibility}>
                {formData.showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="block w-full border rounded-md p-2"
            >
              <option value="">Select Role</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="mt-4">
            <span>Already have an account?</span>
            <Link to="/login" className="ml-2 text-indigo-500 underline">
              Sign In
            </Link>
          </div>
        </form>
        <ToastContainer autoClose={2000} theme="light" />
      </div>
    </div>
  );
};
export default Register;
