import React, {useEffect, useState, useRef} from 'react';
import close from '../svg/close.svg';
import paystack from '../svg/paystack.svg'
import paypal from '../svg/paypal.svg'
import flutterwave from '../svg/flutterwave.svg'
import stripe from '../svg/stripe.svg'
import { toast } from 'react-toastify';
import { LineWave } from 'react-loader-spinner';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  details: any
 
}

const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose,onSubmit, details }) => {

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 transition-opacity flex  items-start sm:items-center justify-center">
      <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
      <div className="relative p-4 w-full max-w-md max-h-full">
      <div className='  flex justify-center p-4'>      
             <span
        className=" bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
        onClick={onClose}
      >
        <img src={close} alt="x" width={40} height={40} />
      </span> 
      </div> 
      
        <div className="relative bg-white rounded-lg shadow">
          <div className="p-4 md:p-5">
            <h1 className="text-center font-bold"> Summary</h1>

            <div className="flex-col max-w-sm space-y-2 justify-center mt-8 mb-28">
               <div className='border-b    pb-2 flex justify-between'>
                   <span className=''> Points Balance </span>
                   <span className='font-medium' > {details?.balance} </span>
               </div>

               <div className='border-b    pb-2 flex justify-between'>
                   <span className=''> Amount </span>
                   <span className='font-medium' > {details?.points} </span>
               </div>

               <div className='    pb-2 flex justify-between'>
                   <span className=''>  Total  </span>
                   <span className='font-medium' > {details?.points} </span>
               </div>
                 
                 
            </div>
            
            <button
            
              onClick={() => onSubmit()}
              className="w-full   flex text-white items-center  justify-center bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center"
            >
         
                Proceed

            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;