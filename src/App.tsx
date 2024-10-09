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
import CreateCampaign from './components/CreateCampaign.tsx/CreateCampaign';
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
        {/* Protected routes */}
        <Route
          path='/CreateCampaign'
          element={
            <ProtectedRoute>
              <CreateCampaign />
            </ProtectedRoute>
          }
        />
        
        <Route
          path='/UserProfile'
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/Wallet'
          element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          }
        />
        <Route
          path='/Analytics'
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
   

       <Route
          path='/Notifications'
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        
       <Route
          path='/Feed'
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />

        


        {/* Public routes */}
        <Route path='/' element={<Home />} />
        <Route path='/SignIn' element={<SignIn />} />
        <Route path='/SignUp' element={<SignUp />} />
        <Route path='/ForgotPassword' element={<ForgotPassword />} />
        <Route path='/ResetPassword' element={<ResetPassword />} />
        <Route path='/VerifyEmail' element={<VerifyEmail />} />
        <Route path='/NewPassword' element={<NewPasword />} />
        <Route path='/Search' element={<Search />} />
        <Route path='/ViewCampaign/:uid' element={<ViewCampaign />}   />
      </Routes>
    </Router>
  </>
  );
}

export default App;
