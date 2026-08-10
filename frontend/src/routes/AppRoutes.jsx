import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "../components/layout/Layout";

import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import Insights from "../pages/Insights";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Profile from "../pages/Profile";
import AdminDashboard from "../pages/AdminDashboard";
import PaymentPage from "../pages/PaymentPage";

import { AddTransactionModal } from "../components/modals/AddTransactionModal";
import { PrivateRoute } from "../components/navigations/PrivateRoute";
import { AdminRoute } from "../components/navigations/AdminRoute";

export function AppRoutes() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/admin" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />

      <Route path="/upgrade" element={
        <PrivateRoute>
          <PaymentPage />
        </PrivateRoute>
      } />

      <Route path="/*" element={
        <PrivateRoute>
          <Layout onAddTransaction={() => setIsModalOpen(true)}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions onAddClick={() => setIsModalOpen(true)} />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
            <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          </Layout>
        </PrivateRoute>
      } />
    </Routes>
  );
}
