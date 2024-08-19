import { useState } from 'react';
import logo from './svg/logo.svg';
import facebook from './svg/facebook.svg';
import instagram from './svg/instagram.svg';

const ForgotPassword = () => {
  return (
    <>
    <div className="min-h-screen flex items-center justify-start bg-cover bg-center overflow-hidden" style={{ backgroundImage: 'url(images/formbanner.png)' }}>
    <div className="w-full max-w-md bg-white rounded-lg shadow dark:border p-6 space-y-4 md:space-y-6 mx-5 mt-3 md:mx-10 md:my-10">
            <div className="flex justify-center">
              <img src={logo} alt="Logo" />
            </div>
            <div className="my-1 flex justify-center text-lg font-medium leading-tight tracking-tight text-gray-900 md:text-xl">
      Forgot Password
            </div>
            <div className="flex justify-center text-sm leading-tight tracking-tight text-gray-900 my-1">
            Provide your email address to continue.
            </div>
            <form className="space-y-20 md:space-y-20" action="#">
 
              <div className='mb-20'>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Email Address"
                  required
                />
              </div>
               
              
            
              <div className='mb-20'>
                <button className="bg-customBlue text-white p-2.5 rounded-md w-full mb-20">
             Continue
                </button>
              </div>
            </form>
 
          </div>
        </div>
  
    </>
  );
};

export default ForgotPassword;
