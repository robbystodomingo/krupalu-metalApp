import './App.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useContext, useState, useEffect } from "react";
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import AdvertiserDashboard from './pages/AdvertiserDashboard';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import SellerRegistrationPage from './pages/SellerRegistrationPage'
import BuyerRegistrationPage from './pages/BuyerRegistrationPage'
import AdvertiserRegistrationPage from './pages/AdvertiserRegistrationPage'
import PaymentRegistrationPage from './pages/PaymentRegistrationPage'


import ShowNavBar from './component/ShowNavBar';
import Navbar from './component/Navbar';
import Sidenav from './component/Sidenav';
import Layout from "./utils/Layout";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import SellersList from './pages/SellersList';
import AdvertisersList from './pages/AdvertisersList';
import BuyersList from './pages/BuyersList';
import AdminBuyersList from './pages/AdminBuyersList'
import AdminSellersList from './pages/AdminSellersList'
import AdminAdvertisersList from './pages/AdminAdvertisersList'

import ProtectedRoute from "./component/ProtectedRoute";

import axios from "axios";

function App() {

  const [role, setRole] = useState(() => localStorage.getItem("role"));

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("/api/v1/user/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        localStorage.setItem("userId", response.data.id);
        localStorage.setItem("email", response.data.email);

        if (response.data.roles?.length > 0) {
          localStorage.setItem("role", response.data.roles[0]);
          setRole(response.data.roles[0]);
        }
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    }

    fetchCurrentUser();
  }, []);



  return (
    <BrowserRouter>
      <ShowNavBar>
        <Navbar />
        {/* <Sidenav /> */}
      </ShowNavBar>
      <Layout role={role} setRole={setRole}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage setRole={setRole} />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/joinasseller" element={<SellerRegistrationPage />} />
          <Route path="/joinasbuyer" element={<BuyerRegistrationPage />} />
          <Route path="/joinasadvertiser" element={<AdvertiserRegistrationPage />} />
          <Route path="/registerPaymentMethod" element={<PaymentRegistrationPage />} />

          {/* Protected routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/buyersList" element={<ProtectedRoute><AdminBuyersList /></ProtectedRoute>} />
          <Route path="/admin/sellersList" element={<ProtectedRoute><AdminSellersList /></ProtectedRoute>} />
          <Route path="/admin/advertisersList" element={<ProtectedRoute><AdminAdvertisersList /></ProtectedRoute>} />
          <Route path="/seller" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
          <Route path="/buyer" element={<ProtectedRoute><BuyerDashboard /></ProtectedRoute>} />
          <Route path="/advertiser" element={<ProtectedRoute><AdvertiserDashboard /></ProtectedRoute>} />
          <Route path="/buyer/sellersList" element={<ProtectedRoute><SellersList /></ProtectedRoute>} />
          <Route path="/buyer/advertisersList" element={<ProtectedRoute><AdvertisersList /></ProtectedRoute>} />
          <Route path="/advertiser/sellersList" element={<ProtectedRoute><SellersList /></ProtectedRoute>} />
          <Route path="/advertiser/buyersList" element={<ProtectedRoute><BuyersList /></ProtectedRoute>} />
          <Route path="/seller/buyersList" element={<ProtectedRoute><BuyersList /></ProtectedRoute>} />
          <Route path="/seller/advertisersList" element={<ProtectedRoute><AdvertisersList /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;