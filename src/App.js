import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useContext, useState } from "react";
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

import { BrowserRouter,Routes,Route } from "react-router-dom";



function App() {

  const [role, setRole] = useState(null);

  return (
    <BrowserRouter>
      <ShowNavBar>
        <Navbar/>
        {/* <Sidenav /> */}
      </ShowNavBar>
      <Layout role={role}>
        <Routes>
          <Route path = "/" element = { <HomePage/>} />
          <Route path = "/login" element = { <LoginPage setRole={setRole}/>} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/buyer" element={<BuyerDashboard />} />
          <Route path="/advertiser" element={<AdvertiserDashboard />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/joinasseller" element={<SellerRegistrationPage />} />
          <Route path="/joinasbuyer" element={<BuyerRegistrationPage />} />
          <Route path="/joinasadvertiser" element={<AdvertiserRegistrationPage />} />
          <Route path="/registerPaymentMethod" element={<PaymentRegistrationPage />} />
        </Routes>
        </Layout>
    </BrowserRouter>
  );
}

export default App;