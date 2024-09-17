import React, { useState } from 'react';
import close from '../svg/close.svg';
import { baseURL } from '../URL';
import { toast } from "react-toastify";
import { LineWave } from 'react-loader-spinner';
interface BankDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed : () => void;
  // onSubmit: (bankDetails: {
  //   bankName: string;
  //   bankAccountNumber: string;
  //   bankAccountName: string;
  // }) => void;
  details : any
}

const BankDetails: React.FC<BankDetailsProps> = ({ isOpen, onClose, onProceed, details }) => {
  const [bankName, setBankName] = useState<string>('');
  const [bankAccountNumber, setBankAccountNumber] = useState<string>('');
  const [bankAccountName, setBankAccountName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!bankName || !bankAccountNumber || !bankAccountName) {
      setError('Please fill in all fields.');
      toast.error('Please fill in all fields.');
    } else {
      setError('');
      UpdateBankDetails();
    }
  };


  const URL = `${baseURL}/BankAccount/UpdateBankAccount`;

  const UpdateBankDetails = async () => {
      setLoading(true);
  
      try {
          const response = await fetch(URL, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${window.localStorage.getItem('token')}`
              },
              body: JSON.stringify({ 
               id: 5,
               bankName: bankName,
               bankAccountNumber: bankAccountNumber,
               bankAccountName: bankAccountName
              }),
          });
  
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const responseData = await response.json();
   
  
          if (responseData) {
              toast.success("Bank Details Added");
              // onProceed();
          }
      } catch (err) {
          toast.error((err as Error).message);
      } finally {
          setLoading(false);
          console.log("Bank Details Added", bankName, bankAccountNumber, bankAccountName);
          onProceed();
      }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 transition-opacity flex items-start sm:items-center justify-center">
      <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className='flex justify-center p-4'>
          <span
            className="bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={onClose}
          >
            <img src={close} alt="x" width={40} height={40} />
          </span>
        </div>
        <div className="relative bg-white rounded-lg shadow">
          <div className="p-4 md:p-5">
            <h1 className="text-center font-bold">Bank Details </h1>
            <p className="p-1 text-sm text-center font-sans mb-4">
            Enter the bank details you wish to redeem your points into.
            </p>

            <div className="flex-col max-w-sm space-y-4 justify-center mb-40">
              {error && <p className="text-red-500 text-xs my-2">{error}</p>}

            
            <div className='mb-2'>               
              <input
                onChange={(e) => setBankAccountNumber(e.target.value)}
                value={bankAccountNumber}
                id="bankAccountNumber"
                className="w-full py-2 px-3 text-sm rounded-md border text-gray-900"
                placeholder=" Account Number"
              />
              </div>

                
              <div className='mb-2'>              
              <input
                onChange={(e) => setBankName(e.target.value)}
                value={bankName}
                id="bankName"
                className="w-full py-2 px-3 text-sm rounded-md border text-gray-900"
                placeholder="Bank "
              />
                </div>




              <div className='mb-2'>       
                <input
                onChange={(e) => setBankAccountName(e.target.value)}
                value={bankAccountName}
                id="bankAccountName"
                className="w-full py-2 px-3 text-sm rounded-md border text-gray-900"
                placeholder="Account Name"
              />
              </div>


          
            </div>

                        <button
              disabled={loading}
              onClick={handleSubmit}
              className={`w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                loading ? 'opacity-50 cursor-not-allowed bg-gray-700' : '  bg-customBlue'
              }`}
            >
             Proceed
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;
