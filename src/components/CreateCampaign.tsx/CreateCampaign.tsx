import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../NavBar/Navbar';
import Step1 from './Step1';
import Step2 from './Step2'


const CreateCamaign = () => {
    const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    
  });
 
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleChange = (input:any) => (e:any) => {
    setFormData({ ...formData, [input]: e.target.value });
    console.log(formData)
  };

  useEffect(() => {
    console.log("FORMData>>>>>>>>>>>>>",formData);
  }, [formData]);

  const renderStep = (currentStep:any, formData:any, handleChange:any, nextStep:any, prevStep:any) => {
    switch (currentStep) {
      case 1:
        return <Step1 nextStep={nextStep} handleChange={handleChange} formData={formData} />;
 
        
      case 2:
        return <Step2 prevStep={prevStep}  handleChange={handleChange} formData={formData} />;
      default:
        return (<div>Form Complete</div>);
    }
  };
  

  return(

    <div>
        <Navbar />
    {renderStep(currentStep, formData, handleChange, nextStep, prevStep)}
  </div>

  )

};

export default CreateCamaign;
