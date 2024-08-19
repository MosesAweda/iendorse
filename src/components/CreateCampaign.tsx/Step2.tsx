import { useState } from 'react';
import { Link } from 'react-router-dom';
import upload from '../svg/upload.svg'


const Step2 = ({ prevStep, handleChange, formData }:any)  => {
 
    const handleSubmit = (e:any) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
      };
    
 
    return (
        <> 

            <div className="flex bg-gray-100 justify-center text-xs ">
             <div className='bg-white p-5 rounded-lg max-w-md h-auto my-10'>
             <div className="flex items-center justify-center mb-5">
          <div className="flex-1 border-1 border-t border-gray-300"></div>
          <div className="flex-1 border-2    border-t border-customBlue"></div>
        </div>
                <img src="./images/frame1.png" alt="frame1" className=' mx-auto'/>

                    <h1> Target Audience</h1>
                <p> Ensure your campaign gets the views and reach it needs</p>

                <form className="space-y-4 mt-4 " action="#" >
        <div>
          <select  
                name="Occupation"
            
                id="email"
                onChange={handleChange('Occupation')} value={formData.Occupation}
                className="border border-gray-300 text-gray-700  rounded-lg focus:ring-blue-500 
                focus:border-blue-500 block w-full p-2.5"
            >
                 <option selected disabled> Occupation</option>
              <option> Option 2</option>

            </select>
        </div>



        <div>
          <input  
                    placeholder='Age'
                name="Age"
                onChange={handleChange('Age')} value={formData.Age}
                id="email"
                className="border border-gray-300 text-gray-700   rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
                 
        </div>
       
        <div onClick={prevStep} className='text-gray-700 py-1 cursor-pointer my-3'> Back </div>

        <button
          onClick={handleSubmit}
          className="w-full  text-white bg-gray-400 hover:bg-blue-900 focus:ring-4 focus:outline-none
          focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
          "
        >  <img src={upload} alt="upload" className='inline-block mr-2'/>
            Publish
        </button>
   
      </form>
             </div>
            </div>
        </>
    );
};

export default Step2;
