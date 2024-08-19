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
import Notifications from './components/Notifications';
import Search from './components/Search';
import CreateCampaign from './components/CreateCampaign.tsx/CreateCampaign';
import Feed from './components/Feeds/Feeds';
import Analytics from './components/Feeds/Analytics';
import Sidebar from './components/Sidebar';
import UserProfile from './components/UserProfie';
import HomeCampaign from './components/HomeCampaign';
import Wallet from './components/Wallet/Wallet';
import Support from './components/Support';


function App() {
  return (
    <>
     <Router>
     <ToastContainer />
     <Routes>
     <Route path='/Sidebar' element={<Sidebar />} />
        <Route path='/' element={<Home />} />
        <Route path='Feed' element={<Feed />} />
        <Route path='/ViewCampaign/:uid' element={<ViewCampaign />} />
        <Route path='/UserProfile' element={<UserProfile />} />
        <Route path='/Wallet' element={<Wallet />} />
        <Route path='/Analytics' element={<Analytics />} />
        <Route path='/CreateCampaign' element={<CreateCampaign />} />
        <Route path='/Notifications' element={<Notifications />} />
        <Route path='/NewPassword' element={<NewPasword />} />
        <Route path='/VerifyEmail' element={<VerifyEmail />} />
        <Route path='/ForgotPassword' element={<ForgotPassword />} />
        <Route path='/ResetPassword' element={<ResetPassword />} />
        <Route path='/SignIn' element={<SignIn />} />
        <Route path='/Search' element={<Search />} />
        <Route path='/SignUp' element={<SignUp />} />
        <Route path='/Support' element={<Support />} />
        </Routes>
    </Router>
    </>
 
  );
}

export default App;
