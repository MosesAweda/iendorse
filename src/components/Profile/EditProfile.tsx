import React, { useEffect, useState } from 'react';
import close from '../svg/close.svg';
import editPen from '../svg/editPen.svg';
import { toast } from "react-toastify";
import PhoneInput from 'react-phone-input-2';
import { baseURL } from '../URL';
interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ isOpen, onClose }) => {
  const userData: any = window.localStorage.getItem("userData");
  const parsedUserData = JSON.parse(userData);
  const [fullName, setFullName] = useState<string>(userData?.fullName || '');
  const [sex, setSex] = useState<string>(userData?.sex || '')
  const [occupation, setOccupation] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const token = parsedUserData?.jwtToken || '';
  const [profilePicture, setProfilePicture] = useState<string>("");

  const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map(name => name[0]).join('');
    return initials.toUpperCase();
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);

  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    switch (name) {
      case 'fullName':
        setFullName(value);
        break;
      case 'occupation':
        setOccupation(value);
        break;
      case 'sex':
        setSex(value);
        break;
      default:
        break;
    }
  }


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
  
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
  
          const size = Math.min(img.width, img.height); // The size will be the smallest dimension
  
          // Set canvas to square dimensions
          canvas.width = size;
          canvas.height = size;
  
          // Draw the image onto the canvas, centered, and cropped to a square
          ctx?.drawImage(
            img,
            (img.width - size) / 2,  // Start cropping from this x position
            (img.height - size) / 2, // Start cropping from this y position
            size,  // Crop width
            size,  // Crop height
            0,     // Place at x=0 on the canvas
            0,     // Place at y=0 on the canvas
            size,  // Width of the canvas
            size   // Height of the canvas
          );
  
          // Convert the canvas back to a data URL
          const resizedImage = canvas.toDataURL('image/jpeg');
          setProfilePicture(resizedImage); // Set the resized image as the profile picture
        };
      };
      reader.readAsDataURL(file);
    }
  };
  



  const handleSubmit = async () => {
    if (!fullName || !sex || !occupation) {
      setError('Please fill in all fields.');
      return;
    }
  
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('sex', sex);
    formData.append('emailAddress', parsedUserData.emailAddress);
    formData.append('occupation', occupation);
    formData.append('phoneNumber', phoneNumber);
    if (profilePicture) {
      formData.append('imageBase64String', profilePicture);
    }
  
    try {
      const response = await fetch(`${baseURL}/Account/UpdateUserAccountDetails`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
  
      const updatedUserData = await response.json();
      window.localStorage.setItem("userData", JSON.stringify(updatedUserData));
      toast.success('Profile updated successfully');
      onClose();
  
    } catch (err) {
      toast.error((err as Error).message);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start sm:items-center justify-center z-50">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className='flex justify-center p-4'>
          <span
            className="bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={onClose}
          >
            <img src={close} alt="Close" width={40} height={40} />
          </span>
        </div>
        <div className="relative bg-white rounded-lg shadow">
          <div className="py-3">
            <div className='border-b pb-2'>
              <h1 className="text-center font-bold">Edit Profile</h1>
            </div>

            <div className='px-5'>
              <div className='flex justify-center mb-3 mt-3'>
                <div className="relative inline-block">
                  <label htmlFor="profile-picture-upload">
                  {profilePicture ? (
                      <img
                        className="rounded-full border-2 border-white cursor-pointer"
                        style={{ boxShadow: '0 0 0 1px #0D236E' }}
                        src={profilePicture}
                        width={45}
                        height={45}
                        alt="Avatar"
                      />
                    ) : (

                      <div className="flex items-center justify-center h-20 w-20 bg-blue-100 rounded-full text-customBlue font-bold text-lg">
                        {getInitials(parsedUserData.fullName)}
                      </div>

                    )}

                    <img
                      width={70}
                      height={70}
                      src={editPen}
                      className="absolute top-[9px] right-0 transform translate-x-1/4 translate-y-1/4"
                      alt="Edit"
                    />
                  </label>
                  <input
                    id="profile-picture-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e)}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="flex-col max-w-sm space-y-3 justify-center mb-5">
                {error && <p className="text-red-500 text-xs my-2">{error}</p>}

                <div className="relative w-full">
                  <label className="absolute left-3 top-1 text-xs text-gray-400 px-1">
                    Email Address
                  </label>
                  <input
                    value={parsedUserData.emailAddress}
                    readOnly
                    className="w-full pt-5 pb-2 px-4 text-xs bg-gray-50 rounded-md border text-gray-900"
                    placeholder="Email Address"
                  />
                </div>

                <div className="relative w-full">
                  <label className="absolute left-3 top-1 text-xs text-gray-900 px-1">
                    Full Name
                  </label>
                  <input
                    name="fullName"
                    value={fullName}
                    onChange={handleChange}
                    className="w-full pt-5 pb-2 px-4 text-xs bg-gray-50 rounded-md border text-gray-900"
                    placeholder="Full Name"
                  />
                </div>

                <div className="relative w-full bg-gray-50">
                  <label className="pl-2 py-2 mb-2 left-3 w-full text-xs text-gray-900 px-1">
                    Phone Number
                  </label>
                  <PhoneInput
                    country={'ng'}
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    inputStyle={{ border: 'none' }}
                    inputClass="w-full pt-5 pb-2 px-4 text-xs bg-gray-50 rounded-md text-gray-900 focus:ring-primary-600 focus:border-primary-600"
                    buttonStyle={{ border: 'none', backgroundColor: 'transparent' }}
                  />
                </div>

                <div className="relative w-full">
                  <label className="absolute left-3 top-1 text-xs text-gray-900 px-1">
                    Sex
                  </label>
                  <input
                    name="sex"
                    value={sex}
                    onChange={handleChange}
                    className="w-full pt-5 pb-2 px-4 text-xs bg-gray-50 rounded-md border text-gray-900"
                    placeholder="Sex"
                  />
                </div>

                <div className="relative w-full">
                  <label className="absolute left-3 top-1 text-xs text-gray-900 px-1">
                    Occupation
                  </label>
                  <input
                    name="occupation"
                    value={occupation}
                    onChange={handleChange}
                    className="w-full pt-5 pb-2 px-4 text-xs bg-gray-50 rounded-md border text-gray-900"
                    placeholder="Occupation"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
