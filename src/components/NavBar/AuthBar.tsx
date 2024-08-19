import React, { useState, useEffect , useRef} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import bell from '../svg/bell.svg';
import home from '../svg/home.svg';
import search from '../svg/search.svg';
import plus from '../svg/plus.svg';
import feed from '../svg/feed.svg';
import account from '../svg/account.svg';
import close from '../svg/close.svg'
import editPen from '../svg/editPen.svg'
import profile from '../svg/profile.svg';
import money from '../svg/money.svg'
import deleteAccount from '../svg/deleteAccount.svg';
import wallet from '../svg/wallet.svg';
import battery from '../svg/battery.svg';
import support from '../svg/support.svg';


const AuthBar= ({toggleSidebar}:any)=> {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const userData:any = window.localStorage.getItem("userData");
    const token = userData ? JSON.parse(userData).jwtToken : null;
    const userName = userData ? JSON.parse(userData).fullName : null;
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
   
      const toggleMenu = () => {
        setMenuOpen(!menuOpen);
      };
    
      const handleLogout = () => {
        window.localStorage.clear();
        navigate("/SignIn");
        toast.success("Logged out successfully");
      };
    

    
      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node))  {
            setDropdownOpen(false);
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

      

    return(

        <nav className="bg-white w-full z-20 top-0 start-0 border-b border-gray-200">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="/images/logo.png" className="h-12 md:ml-10" alt="iendorse" />
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
         
     <div ref={dropdownRef} className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {userName}  
          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
  
      {dropdownOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-42 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              type="button"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  
            <button
              onClick={toggleMenu}
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="navbar-sticky"
              aria-expanded={menuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className={`items-center justify-between ${menuOpen ? '' : 'hidden'} w-full md:flex md:w-auto md:order-1`}
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
              <li>
                <a
                  href="/"
                  className="block py-2 px-3 text-xs rounded md:bg-transparent md:p-0"
                  aria-current="page"
                >
                  <span className="flex items-center">
                    <img src={home} className="h-5 mr-2" /> Home
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="/Search"
                  className="block py-2 px-3 text-xs rounded md:bg-transparent md:p-0"
                  aria-current="page"
                >
                  <span className="flex items-center">
                    <img src={search} className="h-5 mr-2" /> Search
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="/CreateCampaign"
                  className="block py-2 px-3 text-xs rounded md:bg-transparent md:p-0"
                  aria-current="page"
                >
                  <span className="flex items-center">
                    <img src={plus} className="h-5 mr-2" /> Create Campaign
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="/Feed"
                  className="block py-2 px-3 text-xs rounded md:bg-transparent md:p-0"
                  aria-current="page"
                >
                  <span className="flex items-center">
                    <img src={feed} className="h-5 mr-2" /> My Feed
                  </span>
                </a>
              </li>
              <li> 
                <a
                 onClick={toggleSidebar}
                  href="#"
                  className="block py-2 px-3 text-xs rounded md:bg-transparent md:p-0"
                  aria-current="page"
                >
                  <span className="flex items-center">
                    <img src={account} className="h-5 mr-2" /> My Account
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="/Notifications"
                  className="block py-2 px-3 text-xs rounded md:bg-transparent md:p-0"
                  aria-current="page"
                >
                  <span className="flex items-center">
                    <img src={bell} className="h-5 mr-2" /> Notification
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      
  
    )
} 

export default AuthBar

    
