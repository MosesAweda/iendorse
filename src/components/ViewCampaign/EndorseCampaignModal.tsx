import React, { useEffect, useState } from 'react';
import close from '../svg/close.svg';
import { toast } from 'react-toastify';

interface EndorseCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (units: number, note: string) => void;
}

const EndorseCampaignModal: React.FC<EndorseCampaignModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [note, setNote] = useState("");
  const [units, setUnits] = useState<number>(0);

  const handleNote = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
  };
  const handleNumberOfUnits = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 0) {
      setUnits(0);
    } else {
      setUnits(value);
    }
  };

  const handleSubmit = () => {
    const unitsNumber = units;
    if (!note.trim()) {
      toast.error("Please enter a note.");
      return;
    }
    if (isNaN(unitsNumber) || unitsNumber <= 0) {
      toast.error("Please enter a valid number of units.");
      return;
    }
    onSubmit( unitsNumber, note);
  };

  useEffect(() => {
    if (!isOpen) {
      setNote("");
      setUnits(0);
    }
  }, [isOpen]);

  useEffect(() => {
   
         console.log("note", note, "units", units);

 
  }, [note,units]); 

  


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 transition-opacity flex items-start sm:items-center justify-center">
      <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>

      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="flex justify-center  p-4">
          <span
            className="bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={onClose}
          >
            <img src={close} alt="x" width={40} height={40} />
          </span>
        </div>
        <div className="relative bg-white rounded-lg shadow">
          <div className="p-4 md:p-5">
            <h1 className="text-center font-bold mb-4">Endorse Campaign </h1>
            

            <div className="flex-col max-w-sm space-y-2 justify-center mb-20">
              <div>
                <input
                  onChange={handleNumberOfUnits}
                  id="units"
                  className="w-full py-2 px-3 text-sm mb-2  rounded-md  border text-gray-900"
                  placeholder="Number of units"
                />
                <div className='mb-5  '>  
                    <span className='bg-blue-50 text-blue-500 px-2 text-xs rounded-full py-2' > 1000 naira equals 1 unit </span>
                 
                    </div>
                    </div>

            

              <div className="flex items-center border border-gray-200 rounded mt-20">
                <div className="w-full">
                  <textarea
                    onChange={handleNote}
                    name="note"
                    id="note"
                    value={note}
                    rows={6}
                    className="resize-none  text-gray-900 text-sm  block w-full p-2.5"
                    placeholder="Leave an Endorse note"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
             { note != '' && units > 0 ? "Proceed to Pay" : "Proceed  "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndorseCampaignModal;
