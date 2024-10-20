import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../NavBar/Navbar';
import Step1 from './Step1';
import Step2 from './Step2'
import { baseURL } from '../URL';
import useFetch from '../Hooks/useFetch';

const EditCampaign = () => {
    
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
  });
   
  const campaignURL = `${baseURL}/Campaign/CampaignDetails?CampaignId=39`

  const fetchCampaign = async () => {
    setLoading(true);
    try{
        const apiResponse = await fetch(campaignURL, {
            headers:{
                "content-type": "application/json",
                "Authorization": `Bearer ${window.localStorage.getItem("token")}`   
            }
        });
        if (!apiResponse.ok) {
            throw new Error('Failed to fetch');
          }
        const responseData =await apiResponse.json();
        if(apiResponse.ok){
            setFormData(responseData.data);
            setLoading(false);
        }
    }catch(err){
        console.error(err);
       // setLoading(false);
        // setError(err)
    }finally{
      setLoading(false)
    }

}

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleFieldChange = (fieldName: string) => (e: any) => {
    const value = Array.isArray(e) ? e : e?.target?.value; // Check if the value is an array or from an event object
    setFormData(prevFormData => ({
      ...prevFormData,
      [fieldName]: value,
    }));
   // console.log(formData)
  };


  const handleTagChange = (fieldName: string) => (e: any) => {
    const value = Array.isArray(e) ? e : e?.target?.value; // Check if the value is an array or from an event object
    setFormData(prevFormData => ({
      ...prevFormData,
      [fieldName]: value,
    }));
   // console.log(formData)
  };
  


 
  
  const handleFileChange = (fieldName: string) => (files: string[]) => {
    setFormData({
      ...formData,
      [fieldName]: files,
    });
  };

 

  useEffect(() => {
    fetchCampaign();
  }, []);


 const renderStep = (currentStep:any, formData:any, handleTagChange:any, handleFieldChange:any,  nextStep:any, prevStep:any) => {
    switch (currentStep) {
      case 1:
        return <Step1 nextStep={nextStep} handleFieldChange={handleFieldChange} handleTagChange={handleFieldChange} handleFileChange={handleFileChange} formData={formData} />;
 
        
      case 2:
        return <Step2 prevStep={prevStep}  handleFieldChange={handleFieldChange}  handleTagChange={handleFieldChange}  formData={formData} />;
      default:
        return (<div>Form Complete</div>);
    }
  };
  

  return(
    <div>
    <Navbar />
    {loading ? (
      <div>Loading...</div>
    ) : (
      renderStep(currentStep, formData, handleTagChange, handleFieldChange, nextStep, prevStep)
    )}
  </div>

  )

};

export default EditCampaign;
