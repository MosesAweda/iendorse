import React, { useState } from 'react';
import axios from 'axios';

const CloudinaryUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
    setUploadUrl(null); // Reset URL on new file selection
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('upload_preset', 'forIendorse'); // Replace with your preset
    formData.append('cloud_name', 'dgso4wgqt'); // Replace with your Cloudinary cloud name

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dgso4wgqt/image/upload`, // Replace your_cloud_name
        formData
      );
      setUploadUrl(response.data.secure_url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Upload to Cloudinary</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 mb-4"
      />

      <button
        onClick={handleUpload}
        className={`w-full py-2 rounded-lg text-white font-bold ${
          isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        }`}
        disabled={isLoading}
      >
        {isLoading ? 'Uploading...' : 'Upload'}
      </button>

      {uploadUrl && (
        <div className="mt-6 text-center">
          <p className="font-medium text-gray-700">Uploaded Image URL:</p>
          <a
            href={uploadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {uploadUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;
