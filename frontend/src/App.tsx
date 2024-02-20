import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import { ProtectRoutes } from "./utils/protected-routes";
import DashboardLayout from "./components/layouts/Dashboard";
import Home from "./pages/home/Home";
import "./App.css";
import Logout from "./pages/auth/Logout";
import PageNotFound from "./pages/404/PageNotFound";
import Wallet from "./pages/wallet/Wallet";
import CreateWallet from "./pages/wallet/CreateWallet";
import DeleteWallet from "./pages/wallet/DeleteWallet";
import EditWallet from "./pages/wallet/EditWallet";
import Transaction from "./pages/transaction/Transaction";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route element={<ProtectRoutes />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="/wallets" element={<DashboardLayout />}>
            <Route path="create" element={<CreateWallet />} />
            <Route path=":walletId" element={<Wallet />} />
            <Route path=":walletId/edit" element={<EditWallet />} />
            <Route path=":walletId/delete" element={<DeleteWallet />} />
            <Route path=":walletId/transactions" element={<Transaction />} />
            <Route
              path=":walletId/transactions/:transactionId"
              element={<Transaction />}
            />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}
