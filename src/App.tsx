import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, } from 'react-router-dom';
import logo from './logo.svg';
import Home from "./components/Home"
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Login from './components/SignIn';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPasssword';
import NewPasword from './components/NewPassword';
// import { Verify } from 'crypto';
import VerifyEmail from './components/VerifyEmail';
import ViewCampaign from './components/ViewCampaign/ViewCampaign';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Notifications from './components/Notifications/Notifications';
import Search from './components/Search';
import CreateCampaign from './components/CreateCampaign/CreateCampaign';
import EditCampaign from './components/EditCampaign/EditCampaign';
import Feed from './components/Feeds/Feeds';
import Analytics from './components/Feeds/Analytics';
import Sidebar from './components/Sidebar';
import UserProfile from './components/Profile/UserProfie';
import HomeCampaign from './components/HomeCampaign';
import Wallet from './components/Wallet/Wallet';
import Support from './components/Support';
import TransactionDetails from './components/Wallet/TranscationDetails';
import Earnings from './components/Earnings/Earnings';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <>
      <Router>
        <ToastContainer />
        <Routes>

          {/* Protected routes
          <ProtectedRoute>
            <Route path='/CreateCampaign' element={<CreateCampaign />} />
            <Route path='/UserProfile' element={<UserProfile />} />
            <Route path='/Wallet' element={<Wallet />} />
            <Route path='./Analytics/:uid' element={<Analytics />} />
            <Route path='/Notifications' element={<Notifications />} />
            <Route path='/Feed' element={<Feed />} />
          </ProtectedRoute> */}

          <Route element={<ProtectedRoute />}>
          <Route path='/EditCampaign' element={<EditCampaign />} />
            <Route path='/CreateCampaign' element={<CreateCampaign />} />
            <Route path='/UserProfile' element={<UserProfile />} />
            <Route path='/Wallet' element={<Wallet />} />
            <Route path='Feed/Analytics/:uid' element={<Analytics />} />
            <Route path='/Notifications' element={<Notifications />} />
            <Route path='/Feed' element={<Feed />} />
          </Route>

          {/* Public routes */}
          <Route path='/' element={<Home />} />
          <Route path='/SignIn' element={<SignIn />} />
          <Route path='/SignUp' element={<SignUp />} />
          <Route path='/ForgotPassword' element={<ForgotPassword />} />
          <Route path='/ResetPassword' element={<ResetPassword />} />
          <Route path='/VerifyEmail' element={<VerifyEmail />} />
          <Route path='/NewPassword' element={<NewPasword />} />
          <Route path='/Search' element={<Search />} />
          <Route path='/ViewCampaign/:uid' element={<ViewCampaign />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
