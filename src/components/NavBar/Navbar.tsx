import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DefaultNav from './DefaultNav';
import GuestNavbar from "./GuestNavBar";
import AuthBar from "./AuthBar";
import close from '../svg/close.svg';
import editPen from '../svg/editPen.svg';
import profile from '../svg/profile.svg';
import money from '../svg/money.svg';
import deleteAccount from '../svg/deleteAccount.svg';
import wallet from '../svg/wallet.svg';
import battery from '../svg/battery.svg';
import support from '../svg/support.svg';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const userData = window.localStorage.getItem("userData");
  const token = userData ? JSON.parse(userData).jwtToken : null;
  const userName = userData ? JSON.parse(userData).fullName : null;
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    window.localStorage.clear();
    setIsAuthenticated(false);
    navigate("/SignIn");
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);  // Simulating the end of loading
  }, [token]);

  // useEffect(() => {
  //   if(!token){
  //     navigate("/SignIn");
  //     toast("Sign In first!")
  //   }
  // }, [])

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Conditional rendering of Navbar based on loading state */}
      {isLoading ? (
        <DefaultNav />
      ) : (
        isAuthenticated ? <AuthBar toggleSidebar={toggleSidebar} /> : <GuestNavbar />
      )}

      {/* Sidebar */}
      <div className={`fixed z-20 inset-0 bg-black bg-opacity-50 transition-opacity duration-[2000ms]ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Close Button */}
       
        <span className={`fixed top-1/2 transform -translate-y-1/2 p-2 text-white rounded transition-transform duration-[2000ms] ease-in-out ${isOpen ? 'right-80 translate-x-0' : 'right-0 translate-x-full'}`} onClick={toggleSidebar}>
          <img src={close} alt="x" width={40} height={40} />
        </span>
     
      </div>

      {/* Sidebar */}
      <div className={`fixed z-40 top-0 right-0 h-full bg-white text-CustomBlue w-80 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-[2000ms] ease-in-out`}>
        <div className="flex flex-col justify-center items-center">
          <div className="relative inline-block mt-10">
            <img className="rounded-full border-2 border-white" style={{ boxShadow: '0 0 0 1px #0D236E' }} src="/images/Avatar.png" width={45} height={45} alt="Avatar" />
            <img
              width={70}
              height={70}
              src={editPen}
              className="absolute top-[9px] right-0 transform translate-x-1/4 translate-y-1/4"
              alt="Edit"
            />
          </div>
          <div className="my-2">
            <p className="font-bold text-center"> {userName}</p>
            <p className="text-center text-xs"> Human Rights Activist</p>
          </div>
          <div>
            <ul className="py-2 space-y-2 text-sm mx-4 text-gray-800" aria-labelledby="dropdownDefaultButton">
              <li className="hover:bg-gray-100 rounded-lg">
                <a href="/UserProfile" className="block px-16 py-2">
                  <img src={profile} className="align-middle mr-2 inline w-4 h-4" />
                  <span className="inline align-middle"> My Profile </span>
                </a>
              </li>
              <li className="hover:bg-gray-100 rounded-lg">
                <a href="#" className="block px-16 py-2">
                  <img src={money} className="align-middle mr-2 inline w-4 h-4" />
                  <span className="inline align-middle"> My Earnings </span>
                </a>
              </li>
              <li className="hover:bg-gray-100 rounded-lg">
                <a href="/wallet" className="block px-16 py-2">
                  <img src={wallet} className="align-middle mr-2 inline w-4 h-4" />
                  <span className="inline align-middle"> My Wallet </span>
                </a>
              </li>
              <li className="hover:bg-gray-100 rounded-lg">
                <a href="#" className="block px-16 py-2">
                  <img src={battery} className="align-middle mr-2 inline w-4 h-4" />
                  <span className="inline align-middle"> Shared Campaigns </span>
                </a>
              </li>
              <li className="hover:bg-gray-100 rounded-lg">
                <a href="#" className="block px-16 py-2">
                  <img src={support} className="align-middle mr-2 inline w-4 h-4" />
                  <span className="inline align-middle"> Support </span>
                </a>
              </li>
              <li className="hover:bg-gray-100 rounded-lg">
                <a href="#" className="block px-16 py-2">
                  <img src={deleteAccount} className="align-middle mr-2 inline w-4 h-4" />
                  <span className="inline align-middle text-red-700"> Delete Account </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
