  import { useState, useEffect, useRef } from 'react';
  import { Link } from 'react-router-dom';
  import upload from '../svg/upload.svg';
  import useFetch from '../Hooks/useFetch';
  import { baseURL } from '../URL';
  import PeopleModal from './PeopleModal';
  import add from '../svg/add.svg';
  import cancel from '../svg/cancel.svg';
  import { Backdrop, CircularProgress } from "@mui/material";


  const Step1 = ({ nextStep, handleFieldChange, handleTagChange, handleFileChange, formData }: any) => {
    const [peopleModal, setPeopleModal] = useState(false);
    const [selectedPeople, setSelectedPeople] = useState<any[]>(formData.taggedUsers || []);
  //  const [uploadedImages, setUploadedImages] = useState<any[]>(formData.campaignMedias || []);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<{ [key: string]: string }>({});
    const [categoryId, setCategoryId] = useState(formData.categoryId)
    const [campaignTitle, setCampaignTitle] = useState(formData.campaignTitle)
    const [description, setDescription] = useState(formData.description)
    const[campaignFiles, setCampaignFiles] = useState(formData.campaignFiles)
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

    // const handleCampaignMedias = (fieldName: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    //   const target = e.target as HTMLInputElement;

    //   if (target && target.files && target.files.length > 0) {
    //     const newFiles = Array.from(target.files) as File[];

    //     // Convert files to base64 strings
    //     const newBase64Files = await Promise.all(
    //       newFiles.map(file => convertToBase64(file))
    //     );

    //     // Filter out duplicates by checking if the base64 string already exists in uploadedImages
    //     const uniqueNewFiles = newBase64Files.filter(newFile =>
    //       !uploadedImages.includes(newFile)
    //     );

    //     // Combine the new unique files with the existing uploaded files
    //     const combinedFiles = [...uploadedImages, ...uniqueNewFiles];

    //     // Check if the combined files exceed the maximum limit of 5
    //     if (combinedFiles.length > 5) {
    //       setError(prev => ({ ...prev, fileUpload: 'You can upload a maximum of 5 media files.' }));
    //       return;
    //     }

    //     setError(prev => ({ ...prev, fileUpload: '' }));

    //     // Update the uploadedImages state with the combined unique files
    //     setUploadedImages(combinedFiles);
    //   }
    // };



 

    // const removeImage = (index: number) => {
    //   const updatedImages = uploadedImages.filter((_, i) => i !== index);
    //   setUploadedImages(updatedImages);
    // };

    const requestURL = `${baseURL}/Category/GetCategories/`;
    const { data: categories, refreshApi: refreshCategories, error: categoriestError, loading: categoriesLoading } = useFetch(requestURL, "GET", onSuccess, onError);

    useEffect(() => {
      handleTagChange('tags')(selectedPeople); // Pass the entire selectedPeople object array
    }, [selectedPeople]);


    const handleNextStep = () => {
      let formIsValid = true;
      const newErrors: { [key: string]: string } = {};

      // Campaign Title validation
      if (!formData.campaignTitle) {
        newErrors.campaignTitle = 'Please enter a title.';
        formIsValid = false;
      }


      // Campaign Category validation
      if (!formData.categoryId) {
        newErrors.categoryId = 'Please select a campaign category.';
        formIsValid = false;
      }

      // Campaign Link validation
      if (!formData.campaignLink) {
        newErrors.campaignLink = 'Please provide a campaign link.';
        formIsValid = false;
      } else if (!/^(www\.)?[^\s$.?#].[^\s]*$/.test(formData.campaignLink)) {
        newErrors.campaignLink = 'Please provide a valid URL.';
        formIsValid = false;
      }
      // Description validation
      if (!formData.description) {
        newErrors.description = 'Please provide a description.';
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

    // useEffect(() => {
    //   handleFileChange('campaignMedias')(uploadedImages);
    // }, [uploadedImages])



    // useEffect(() => {
    //   if (formData) {
    //     setSelectedPeople(formData.tags || []);   // Default to an empty array if undefined
    //     setCampaignFiles(formData.campaignFiles || []);  // Default to an empty array if undefined
    //     setCampaignTitle(formData.campaignTitle || "");  // Default to empty string
    //     setCategoryId(formData.categoryId || "");
    //     setDescription(formData.description || "");
    //   }
    // }, [formData]);  

 console.log("formData", formData)
    return (
      <>
      {formData && (
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
           <img src="./images/frame1.png" alt="frame1" className='mx-auto' />
           <form className="space-y-4 mt-4 " action="#" onSubmit={(e) => { e.preventDefault() }}>
             <div>
               <select
                 name="categoryId"
                 onChange={handleFieldChange('categoryId')} value={formData.categoryId}
                 className={`border border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
               >
                 <option selected disabled>Campaign Category</option>
                 {categories?.map((item: any) => (
                   <option key={item.id} value={item.id}>{item.categoryName}</option>
                 ))}
               </select>
               {error.categoryId && <p className="text-red-500 text-xs  ml-1 my-1">{error.categotyId}</p>}
             </div>

             <div>
             
               <input
                     placeholder='Campaign Title'
                     name="campaignTitle"
                     value={campaignTitle}
                     onChange={(e) => {
                       setCampaignTitle(e.target.value); // Update local state
                       handleFieldChange('campaignTitle')(e); // Update formData
                     }}
                     className={`border border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${error.CampaignTitle ? 'border-red-500' : ''}`}
                   />
               {error.campaignTitle && <p className="text-red-500 text-xs  ml-1 my-1">{error.campaignTitle}</p>}
             </div>

             <div>
               <input
                 placeholder='Campaign Link'
                 name="CampaignLink"
                 onChange={handleFieldChange('campaignLink')} value={formData.campaignLink}
                 className="border border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
               />
               {error.campaignLink && <p className="text-red-500 text-xs ml-1 my-1">{error.campaignLink}</p>}
             </div>

             <div>
               <textarea
                 placeholder='Description'
                 name="Description"
                 onChange={handleFieldChange('description')} value={formData.description}
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
                       
                       {person.imagePath ? (
                         <img
                           className="rounded-full border-2 border-white mt-2 mx-4"
                           style={{ boxShadow: '0 0 0 1px #0D236E' }}
                           src={person.imagePath}
                           width={38}
                           height={38}
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




             {campaignFiles?.length > 0 && (
               <div className='border-2 p-4 rounded-lg'>
                 <div className='text-gray-700 pb-1'>Uploaded Images</div>
                 <div className="flex flex-wrap justify-start max-h-40 overflow-y-auto">
                   {campaignFiles?.map((item:any, index:any) => (
                     <div
                       key={index}
                       className="relative inline-block mx-2 mt-3 text-center rounded-lg"
                       style={{ width: '80px', height: '80px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', }}
                     >
                    
                       <img
                         className=""
                         style={{ maxWidth: '100%', maxHeight: '100%', }}
                         src={item.filePath}
                         alt={`Uploaded ${index + 1}`}
                       />
                     </div>



                   )
                   )}
                  
                 </div>
               </div>
             )}

 {error.campaignMedias && <p className="text-red-500 text-xs ml-1 my-1">{error.campaignMedias}</p>}

           

             {

               campaignFiles?.length == 0 &&
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
      )}
       

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
