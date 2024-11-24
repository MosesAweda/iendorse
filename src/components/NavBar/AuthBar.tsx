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
import Initials from "../Initials";
import Logout from "../Logout";


const AuthBar= ({toggleSidebar}:any)=> {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const userData:any = window.localStorage.getItem("userData");
    const token = userData ? JSON.parse(userData).jwtToken : null;
    const userName = userData ? JSON.parse(userData).fullName : null;
    const userImage = userData ? JSON.parse(userData).imageUrl : null;
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
      const toggleMenu = () => {
        setMenuOpen(!menuOpen);

      };


    

    
      useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node))  {
            setDropdownOpen(false);
            setMenuOpen(false)
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);
     
      const [position, setPosition] = useState('initial');
      const [lastScrollY, setLastScrollY] = useState(0);
      const [scrollTimer, setScrollTimer] = useState<NodeJS.Timeout | null>(null);
    
      useEffect(() => {
        const handleScroll = () => {
          const currentScrollY = window.scrollY;
          
          // Clear existing timeout
          if (scrollTimer) {
            clearTimeout(scrollTimer);
          }
    
          // Always show navbar at the top of the page
          if (currentScrollY < 100) {
            setPosition('initial');
            setLastScrollY(currentScrollY);
            return;
          }
    
          // Hide navbar when scrolling
          setPosition('hidden');
    
          // Set new timeout to show navbar after scrolling stops
          const newTimer = setTimeout(() => {
            setPosition('visible');
          }, 150);
    
          setScrollTimer(newTimer);
          setLastScrollY(currentScrollY);
        };
    
        window.addEventListener('scroll', handleScroll, { passive: true });
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
          if (scrollTimer) {
            clearTimeout(scrollTimer);
       }
        };
      }, [lastScrollY, scrollTimer]);
    
      const getNavClasses = () => {
        const baseClasses = 'bg-white w-full z-20 border-b border-gray-200 transition-all duration-300';
        
        switch (position) {
          case 'initial':
            return `${baseClasses} relative`;
          case 'hidden':
            return `${baseClasses} fixed top-0 left-0 -translate-y-full shadow-md`;
          case 'visible':
            return `${baseClasses} fixed top-0 left-0 translate-y-0 shadow-md`;
          default:
            return baseClasses;
        }
      };
    return(
      <>
      <nav className={getNavClasses()}>
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="/images/logo.png" className="h-12 md:ml-10" alt="iendorse" />
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
         
     <div  className="relative inline-block text-left">
      <div className="flex cursor-pointer "
        aria-current="page"
        onClick={() => {
          toggleSidebar();
          setMenuOpen(false);
        }}>
      <div className="  inline-block flex items-center z-1 mr-3 " >
          {userImage ? (
            <img className="rounded-full border-2 border-white" style={{ boxShadow: '0 0 0 1px #0D236E' }}
             src={userImage} width={36} height={36} alt="Avatar" />
          ):(
            <div className="flex items-center justify-center h-10 w-10 bg-blue-100 rounded-full text-customBlue p-2">
            <Initials fullName={userName} className="text-xs " />  
            </div>
          )
        } 
        <span className="ml-2 align-middle  text-sm text-gray-700">  {userName} </span>
        
          </div>
          </div>
  
      
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
                 onClick={() => {
                  toggleSidebar();
                  setMenuOpen(false);
                }}
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
  
      </>
  
    )
} 

export default AuthBar

    
