"use client";

import { useSelector } from "react-redux";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const DashboardContactForm = () => {
  const { name, email } = useSelector((state) => state.user.user || {});
  const { user } = useSelector((state) => state.user);

  console.log("user info", user);
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        name,
        email,
      };

      const response = await axios.post(
        "http://localhost:5000/api/contact/",
        payload
      );
      toast.success(response.data.message || "Message sent!");
      setFormData({ subject: "", message: "", phoneNumber: "" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 px-6 py-8 bg-red-50 rounded-lg shadow-lg">
      <ToastContainer position="top-center" autoClose={3000} />
      <h2 className="text-2xl font-bold text-purple-700 mb-6">
        Send Us a Message
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Subject of your message"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Phone Number
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="+123456789"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Message
          </label>
          <textarea
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Write your message here..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default DashboardContactForm;
