import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import upload from '../svg/upload.svg';
import useFetch from '../Hooks/useFetch';
import { baseURL } from '../URL';
import PeopleModal from './PeopleModal';
import add from '../svg/add.svg';
import cancel from '../svg/cancel.svg';
import { Backdrop, CircularProgress } from "@mui/material";

interface person {
  id: number;
  fullName: string;
  imageUrl?: string;
}

const Step1 = ({ nextStep, handleFieldChange, handleTagChange, handleFileChange, formData }: any) => {
  const [peopleModal, setPeopleModal] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<any[]>(formData.tags || []);
  const [uploadedImages, setUploadedImages] = useState<any[]>(formData.campaignMedias || []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [uploadedVideos, setUploadedVideos] = useState([]);


  const closePeopleModal = () => {
    setPeopleModal(false);
  };
  const openPeopleModal = () => {
    setPeopleModal(true);
  };

  const onSuccess = () => {
    // console.log("success");
  };
  const onError = () => {
    // console.log("error");
  };

  const getInitials = (name: string) => {
    if (name !== null) {
      const nameParts = name.split(' ');
      return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    } else {
      return "";
    }
  };

  const handleSelectPeople = (selected: any) => {
    setSelectedPeople(selected);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleCampaignMedias = (fieldName: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
  
    if (target && target.files && target.files.length > 0) {
      const newFiles = Array.from(target.files) as File[];
  
      // Filter image and video files separately
      const images = newFiles.filter(file => file.type.startsWith('image/'));
      const videos = newFiles.filter(file => file.type.startsWith('video/'));
  
      // Convert files to base64 strings (only images, if preview is needed)
      const newBase64Images = await Promise.all(images.map(file => convertToBase64(file)));
  
      // Filter out duplicates for images
      const uniqueNewBase64Images = newBase64Images.filter(newFile => !uploadedImages.includes(newFile));
  
      // Combine the unique images and original uploaded files (without duplicates)
      const combinedFiles = [...uploadedImages, ...uniqueNewBase64Images];
  
      // Add videos as files, not base64 strings, since previews don't require conversion
      const updatedVideos:any = [...uploadedVideos, ...videos];
  
      if (combinedFiles.length + updatedVideos.length > 5) {
        setError(prev => ({ ...prev, fileUpload: 'You can upload a maximum of 5 media files.' }));
        return;
      }
  
      setError(prev => ({ ...prev, fileUpload: '' }));
  
      // Update the state for both images and videos
      setUploadedImages(combinedFiles);
      setUploadedVideos(updatedVideos); // Maintain a separate state for videos
    }
  };
  



  const removePerson = (id: number) => {
    const updatedPeople = selectedPeople.filter((person: any) => person.id !== id);
    handleSelectPeople(updatedPeople);
  };

  const removeImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
  };

  const removeVideo = (index: number) => {
    const updatedVideos = uploadedVideos.filter((_, i) => i !== index);
    setUploadedVideos(updatedVideos);
  };

  const requestURL = `${baseURL}/Category/GetCategories/`;
  const { data: categories, refreshApi: refreshCategories, error: categoriestError, loading: categoriesLoading } = useFetch(requestURL, "GET", onSuccess, onError);

  useEffect(() => {
    handleTagChange('tags')(selectedPeople); // Pass the entire selectedPeople object array
  }, [selectedPeople]);


  const handleNextStep = () => {
    let formIsValid = true;
    const newErrors: { [key: string]: string } = {};

    // Campaign Title validation
    if (!formData.CampaignTitle) {
      newErrors.CampaignTitle = 'Please enter a title.';
      formIsValid = false;
    }


    // Campaign Category validation
    if (!formData.CampaignCategory) {
      newErrors.CampaignCategory = 'Please select a campaign category.';
      formIsValid = false;
    }

    // Campaign Link validation
    if (!formData.CampaignLink) {
      newErrors.CampaignLink = 'Please provide a campaign link.';
      formIsValid = false;
    } else if (!/^(www\.)?[^\s$.?#].[^\s]*$/.test(formData.CampaignLink)) {
      newErrors.CampaignLink = 'Please provide a valid URL.';
      formIsValid = false;
    }
    // Description validation
    if (!formData.Description) {
      newErrors.Description = 'Please provide a description.';
      formIsValid = false;
    }


    if (!formData.campaignMedias || formData.campaignMedias.length === 0) {
      newErrors.campaignMedias = 'Please upload at least one media file.';
      formIsValid = false;
    }
    setError(newErrors);

    if (formIsValid) {
      nextStep();
    }
  };


  const triggerFileInput = () => {
    fileInputRef.current?.click();
  }

  useEffect(() => {
    handleFileChange('campaignMedias')(uploadedImages);
  }, [uploadedImages])


  return (
    <>
      <div className="flex bg-gray-100 justify-center text-xs ">
        <div className='bg-white p-5 rounded-lg max-w-md h-auto my-10'>
        <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={categoriesLoading}>
              <CircularProgress color="inherit" />
            </Backdrop>
          <div className="flex items-center justify-center mb-5">
            <div className="flex-1 border-2 border-t border-customBlue"></div>
            <div className="flex-1 border-t border-a-300"></div>
          </div>
          <img src="https://res.cloudinary.com/dgso4wgqt/image/upload/v1733390897/frame1_pqfed6.png" alt="frame1" className='mx-auto' />
          <form className="space-y-4 mt-4 " action="#" onSubmit={(e) => { e.preventDefault() }}>
            <div>
              <select
                name="CampaignCategory"
                onChange={handleFieldChange('CampaignCategory')} value={formData.CampaignCategory}
                className={`border border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
              >
                <option selected disabled>Campaign Category</option>
                {categories?.map((item: any) => (
                  <option key={item.id} value={item.id}>{item.categoryName}</option>
                ))}
              </select>
              {error.CampaignCategory && <p className="text-red-500 text-xs  ml-1 my-1">{error.CampaignCategory}</p>}
            </div>

            <div>
              <input
                placeholder='Campaign Title'
                name="CampaignTitle"
                onChange={handleFieldChange('CampaignTitle')} value={formData.CampaignTitle}
                className={`border border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${error.CampaignTitle ? 'border-red-500' : ''}`}
              />
              {error.CampaignTitle && <p className="text-red-500 text-xs  ml-1 my-1">{error.CampaignTitle}</p>}
            </div>

            <div>
              <input
                placeholder='Campaign Link'
                name="CampaignLink"
                onChange={handleFieldChange('CampaignLink')} value={formData.CampaignLink}
                className="border border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              {error.CampaignLink && <p className="text-red-500 text-xs ml-1 my-1">{error.CampaignLink}</p>}
            </div>

            <div>
              <textarea
                placeholder='Description'
                name="Description"
                onChange={handleFieldChange('Description')} value={formData.Description}
                className="border border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"

              />
              {error.Description && <p className="text-red-500 text-xs ml-1 my-1">{error.Description}</p>}

            </div>

            <div>


            </div>

            <div className={`${selectedPeople.length > 0 ? 'hidden' : ''}`}>
              <input
                onClick={openPeopleModal}

                readOnly

                className="border border-gray-300 text-a-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Tag People"
              />
            </div>


            {selectedPeople.length == 0 ? ' ' : <>

              <div className='border-2 p-4 rounded-lg'>
                <div className='text-gray-700 pb-1' > You Tagged</div>
                <div className="flex flex-wrap justify-start max-h-40 overflow-y-auto">

                  {selectedPeople.map(person => (
                    <div key={person.id} className="relative inline-block mx-4 mt-3 text-center">
                      <img
                        src={cancel}
                        className="absolute   cursor-pointer"
                        onClick={() => removePerson(person.id)} // Call removePerson on click
                        alt="Remove"
                      />
                      {person.imageUrl ? (
                        <img
                          className="rounded-full border-2 border-white mt-2 w-10 h-10 mx-4"
                          style={{ boxShadow: '0 0 0 1px #0D236E' }}
                          src={person.imageUrl}
                      
                          alt={person.fullName}
                        />
                      ) : (
                        <div
                          className="flex items-center justify-center rounded-full border-2 text-customBlue mt-2 mx-4 bg-blue-100 text-customBlue"
                          style={{ width: 38, height: 38, boxShadow: '0 0 0 1px #0D236E' }}
                        >
                          <span className="text-sm font-semibold">{getInitials(person.fullName)}</span>
                        </div>
                      )}
                      <span className="text-xs block mt-1 font-medium">{person.fullName}</span>
                    </div>

                  ))}



                  <div className='  '>
                    <img onClick={openPeopleModal} src={add} width={40} height={40} className='my-4' />

                  </div>
                </div>
              </div>
            </>}


            <div>
              {/* Hidden Upload Campaign Media Section */}
              <input
              type="file"
              placeholder="Upload Campaign Media"
              name="campaignMedias"
              onChange={handleCampaignMedias('campaignMedias')}
              className="hidden"
              ref={fileInputRef}
              multiple
              accept="image/*,video/*" // Accepts all images and video types
            />

            </div>


            {uploadedImages.length > 0 && (
              <div className='border-2 p-4 rounded-lg'>
                <div className='text-gray-700 pb-1'>Uploaded Images</div>
                <div className="flex flex-wrap justify-start max-h-40 overflow-y-auto">
  {uploadedImages.map((image, index) => (
    <div key={`image-${index}`} className="relative inline-block mx-2 mt-3">
      <img
        src={cancel}
        alt="Remove"
        className="absolute cursor-pointer"
        onClick={() => removeImage(index)}
        style={{ top: '-5px', right: '-5px', width: '15px', height: '15px' }}
      />
      <img
        src={image}
        alt={`Uploaded ${index + 1}`}
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  ))}

  {uploadedVideos.map((video, index) => (
    <div key={`video-${index}`} className="relative inline-block mx-2 mt-3">
      <img
        src={cancel}
        alt="Remove"
        className="absolute cursor-pointer"
        onClick={() => removeVideo(index)}
        style={{ top: '-5px', right: '-5px', width: '15px', height: '15px' }}
      />
      <video
        controls
        style={{ maxWidth: '100%', maxHeight: '100%' }}
        src={URL.createObjectURL(video)} // Use URL.createObjectURL for video previews
      >
        Your browser does not support video playback.
      </video>
    </div>
  ))}

  <div className="relative inline-block mx-4 mt-3">
    <img onClick={triggerFileInput} src={add} width={40} height={40} className="my-4" />
  </div>
</div>

              </div>
            )}

{error.campaignMedias && <p className="text-red-500 text-xs ml-1 my-1">{error.campaignMedias}</p>}

          

            {

              uploadedImages.length == 0 &&
              (<button
                onClick={triggerFileInput}
                className="w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-1 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center"
              >
                <img src={upload} alt="upload" className='inline-block mr-2' />
                Upload Campaign Media
              </button>
              )

            }

            {error.fileUpload && <p className="text-red-500 text-xs pb-8">{error.fileUpload}</p>}
          
            <button
              onClick={handleNextStep}
              className="w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Next
            </button>
          </form>
        </div>
      </div>

      {/* People Modal */}
      <PeopleModal
        isOpen={peopleModal}
        onClose={closePeopleModal}
        onSelectPeople={handleSelectPeople}
        taggedPeople={selectedPeople}
      />
    </>
  );
};

export default Step1;
