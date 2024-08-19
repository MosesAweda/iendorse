import { useState } from 'react';
import logo from './svg/logo.svg';
import facebook from './svg/facebook.svg';
import instagram from './svg/instagram.svg';

const NewPasword = () => {
  return (
    <>
      <div
        className="min-h-screen flex flex-col bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: 'url(images/formbanner.png)',
        }}
      >
        <div className="flex items-center justify-start w-full px-3 py-4 mx-10    my-20 px-20">
          <div className="w-full max-w-md bg-white rounded-lg shadow dark:border p-6 space-y-4 md:space-y-6">
            <div className="flex justify-center">
              <img src={logo} alt="Logo" />
            </div>
            <div className=" flex justify-center text-lg font-medium leading-tight tracking-tight text-gray-900 md:text-xl">
      Forgot Password
            </div>
            <div className="flex justify-center text-sm leading-tight tracking-tight text-gray-900  ">
            Enter your new password.
            </div>
            <form className="space-y-20 md:space-y-5" action="#">
 
              <div className=''>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder=" New Password"
                  required
                />
              </div>

              
              <div className='mb-20'>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder=" Confirm Password"
                  required
                />
              </div>
               
              
            
              <div className='mb-20  '>
                <button className="bg-customBlue text-white p-2.5 rounded-md w-full mt-20 mb-20">
             Continue
                </button>
              </div>
            </form>
 
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPasword;
