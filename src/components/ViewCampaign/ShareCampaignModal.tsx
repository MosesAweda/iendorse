 import React, { useState } from 'react';
 import danger from './svg/danger.svg';
import x from '../svg/x.svg';
import tiktok from '../svg/tiktok.svg';
import facebook from '../svg/facebook.svg';
import instagram from '../svg/instagram.svg';
import close from '../svg/close.svg';
import link from '../svg/link.svg';
import copy from '../svg/copy.svg';

 
interface ShareCampaignModalProps { 
  isOpen: boolean;
  onClose: () => void;
  details :any
  
}

 const ShareCampaignModal: React.FC<ShareCampaignModalProps> = ({ isOpen, onClose, details }) => {
  console.log("Share Details", details)

  const [copied, setCopied] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const textToCopy = `https://iendorse.vercel.app/ViewCampaign/${details?.campaignId}`
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
    } catch (err) {
      setCopySuccess('Failed to copy!');
    }
  };

  setTimeout(() => {
    setCopied(false);
  }, 4000);


  const shareOnTwitter = (campaignId: number, campaignTitle: string, campaignDescription: string) => {
    const tweetText = `${campaignTitle} - ${campaignDescription}`;
    const campaignUrl = `https://iendorse.vercel.app/ViewCampaign/${campaignId}`;
  
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}&url=${encodeURIComponent(campaignUrl)}`;
  
    // Open the share URL in a new tab
    window.open(twitterShareUrl, '_blank');
  };
  

    return (
        <div>
            <div className={`fixed inset-0 transition-opacity ${isOpen ? 'flex' : 'hidden'}  items-start sm:items-center justify-center`}>
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
     
        <div className="relative z-10 flex-col items-center justify-center max-h-screen">
        <div className='  flex justify-center p-4'>      
             <span
        className=" bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
        onClick={onClose}
      >
        <img src={close} alt="x" width={40} height={40} />
      </span> 
      </div> 
    
          <div className="relative bg-white rounded-lg shadow-xl max-w-lg mx-1 p-10">
            
            <h1 className="my-3 font-bold text-center">Share Campaign</h1>
            {copied && (
        <div className="flex justify-center ml-2 text-green-500 font-medium">
          Copied!
        </div>
      )}
         
            <div className="flex justify-center my-5">
          <div onClick={handleCopy}>
                <img src={copy} alt="copy" className="mx-4" width={40} height={40} />
              </div>
              <div>
                <img src={instagram} alt="instagram" className="mx-4" width={40} height={40} />
              </div>
              <div onClick={() => shareOnTwitter(details.campaignId, details.campaignTitle, details.campaignDescription)}>
                <img src={x} alt="x" className="mx-4" width={40} height={40} />
              </div>
              <div>
                <img src={facebook} alt="fb" className="mx-4" width={40} height={40} />
              </div>
              {/* <div>
                <img src={tiktok} alt="tiktok" className="mx-4" width={40} height={40} />
              </div> */}
            </div>
          </div>
        </div>
      </div> 
        </div>
    )
 }

 export default ShareCampaignModal