import React, { useEffect, useState } from 'react';
import close from '../svg/close.svg';
import { baseURL } from '../URL';
import { toast } from "react-toastify";
import { LineWave } from 'react-loader-spinner';
import Select from 'react-select';

interface BankDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  details: any;
}

// Define interface for bank data
interface BankOption {
  value: string;
  label: string;
  code: string;
}

const BankDetails: React.FC<BankDetailsProps> = ({ isOpen, onClose, onProceed, details }) => {
  const [bankAccountNumber, setBankAccountNumber] = useState<string>('');
  const [bankAccountName, setBankAccountName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [banklist, setBanklist] = useState<BankOption[]>([]);
  const [selectedBank, setSelectedBank] = useState<BankOption | null>(null);
  
  const userData = JSON.parse(localStorage.getItem("userData") as string);
  const userId = userData.id;

  const handleSubmit = () => {
    if (!selectedBank || !bankAccountNumber || !bankAccountName) {
      setError('Please fill in all fields.');
      toast.error('Please fill in all fields.');
    } else {
      setError('');
      UpdateBankDetails();
    }
  };

  const fetchBanks = async () => {
    try {
      const response = await fetch(`${baseURL}/BankAccount/GetBanks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('token')}`
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const responseData = await response.json();
  
      if (responseData && responseData.data) {
        // Transform the API data into the format expected by react-select
        const formattedBanks = responseData.data.map((bank: any) => ({
          value: bank.code,
          label: bank.name,
          code: bank.code
        }));
        
        setBanklist(formattedBanks);
      }
    } catch (err) {
      console.error((err as Error).message);
      toast.error("Failed to fetch banks");
    }
  };

  const UpdateBankDetails = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${baseURL}/BankAccount/UpdateBankAccount`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          id: userId,
          bankName: selectedBank?.label,
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
        onProceed();
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      fetchBanks();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 transition-opacity flex items-start mt-20 sm:mt-1 sm:items-center justify-center">
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
            <h1 className="text-center font-bold">Bank Details</h1>
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
                  placeholder="Account Number"
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

              <div className='mb-2'>
                <Select
                  placeholder="Select Bank"
                  value={selectedBank}
                  onChange={(option) => setSelectedBank(option)}
                  options={banklist}
                  isLoading={banklist.length === 0}
                  classNamePrefix="select"
                  className="basic-single"
                />
              </div>
            </div>

            <button
              disabled={loading}
              onClick={handleSubmit}
              className={`w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                loading ? 'opacity-50 cursor-not-allowed bg-gray-700' : 'bg-customBlue'
              }`}
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <LineWave height="24" width="24" color="white" ariaLabel="loading" />
                  <span className="ml-2">Processing...</span>
                </div>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;