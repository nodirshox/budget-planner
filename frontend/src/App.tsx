import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import { ProtectRoutes } from "./utils/protected-routes";
import DashboardLayout from "./components/layouts/Dashboard";
import Home from "./pages/home/Home";
import Settings from "./pages/settings/Settings";
import "./App.css";
import Logout from "./pages/auth/Logout";
import PageNotFound from "./pages/404/PageNotFound";
import Wallet from "./pages/wallet/Wallet";
import CreateWallet from "./pages/wallet/CreateWallet";
import DeleteWallet from "./pages/wallet/DeleteWallet";
import EditWallet from "./pages/wallet/EditWallet";
import Transaction from "./pages/transaction/Transaction";
import Category from "./pages/category/Category";
import CreateCategory from "./pages/category/CreateCategory";
import EditCategory from "./pages/category/EditCategory";
import DeleteCategory from "./pages/category/DeleteCategory";
import Overview from "./pages/transaction/Overview";
import ClickTransactions from "./pages/transaction/ClickTransactions";
import Password from "./pages/settings/Password";
import Registration from "./pages/auth/Registration";
import Verify from "./pages/auth/Verify";
import LandingPage from "./pages/landing/LandingPage";
import RestoreAccount from "./pages/auth/RestoreAccount";
import RestoreAccountVerify from "./pages/auth/RestoreAccountVerify";
import RestoreAccountSetPassword from "./pages/auth/RestoreAccountSetPassword";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/restore" element={<RestoreAccount />} />
        <Route path="/restore/verify" element={<RestoreAccountVerify />} />
        <Route path="/" element={<LandingPage />} />
        <Route element={<ProtectRoutes />}>
          <Route path="/home" element={<DashboardLayout />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="/settings" element={<DashboardLayout />}>
            <Route index element={<Settings />} />
            <Route path="password" element={<Password />} />
            <Route
              path="set-password"
              element={<RestoreAccountSetPassword />}
            />
          </Route>
          <Route path="/wallets" element={<DashboardLayout />}>
            <Route path="create" element={<CreateWallet />} />
            <Route path=":walletId" element={<Wallet />} />
            <Route path=":walletId/edit" element={<EditWallet />} />
            <Route path=":walletId/delete" element={<DeleteWallet />} />
            <Route path=":walletId/transactions" element={<Transaction />} />
            <Route path=":walletId/overview" element={<Overview />} />
            <Route path=":walletId/click" element={<ClickTransactions />} />
            <Route
              path=":walletId/transactions/:transactionId"
              element={<Transaction />}
            />
          </Route>
          <Route path="/categories" element={<DashboardLayout />}>
            <Route index element={<Category />} />
            <Route path="create" element={<CreateCategory />} />
            <Route path=":categoryId/edit" element={<EditCategory />} />
            <Route path=":categoryId/delete" element={<DeleteCategory />} />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}
