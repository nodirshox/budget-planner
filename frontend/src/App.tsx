import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/auth/SignIn";
import { ProtectRoutes } from "./utils/protected-routes";
import DashboardLayout from "./components/layouts/Dashboard";
import Home from "./pages/home/Home";
import "./App.css";
import Logout from "./pages/auth/Logout";
import PageNotFound from "./pages/404/PageNotFound";
import Wallet from "./pages/wallet/Wallet";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/logout" element={<Logout />} />
        <Route element={<ProtectRoutes />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="/wallets" element={<DashboardLayout />}>
            <Route path=":walletId" element={<Wallet />} />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}
