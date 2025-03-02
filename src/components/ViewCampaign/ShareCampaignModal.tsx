import React, { useState, useEffect } from 'react';
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
  details: any;
}

const ShareCampaignModal: React.FC<ShareCampaignModalProps> = ({ isOpen, onClose, details }) => {
  const [copied, setCopied] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const textToCopy = `https://iendorse.ng/ViewCampaign/${details?.campaignId}`;

  // Add useEffect to handle scroll locking
  // useEffect(() => {
  //   if (isOpen) {
  //     // Save the current scroll position
  //     const scrollY = window.scrollY;
      
  //     // Add styles to prevent scrolling and maintain position
  //     document.body.style.position = 'fixed';
  //     document.body.style.top = `-${scrollY}px`;
  //     document.body.style.width = '100%';
  //   } else {
  //     // Get the scroll position from the body's top property
  //     const scrollY = document.body.style.top;
      
  //     // Remove the styles
  //     document.body.style.position = '';
  //     document.body.style.top = '';
  //     document.body.style.width = '';
      
  //     // Restore scroll position
  //     window.scrollTo(0, parseInt(scrollY || '0') * -1);
  //   }

  //   // Cleanup function
  //   return () => {
  //     document.body.style.position = '';
  //     document.body.style.top = '';
  //     document.body.style.width = '';
  //   };
  // }, [isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
    } catch (err) {
      setCopySuccess('Failed to copy!');
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const shareOnTwitter = (campaignId: number, campaignTitle: string, campaignDescription: string) => {
    const tweetText = `${campaignTitle} - ${campaignDescription}`;
    const campaignUrl = `https://iendorse.ng/ViewCampaign/${campaignId}`;
    
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}&url=${encodeURIComponent(campaignUrl)}`;
    
    window.open(twitterShareUrl, '_blank');
  };

  return (
    <div className={`fixed z-50 inset-0 transition-opacity ${isOpen ? 'flex' : 'hidden'} items-start mt-20 sm:mt-1 sm:items-center justify-center`}>
      <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
      
      <div className="relative z-10 flex-col items-center justify-center max-h-full">
        <div className="flex justify-center p-4">
          <span
            className="bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={onClose}
          >
            <img src={close} alt="x" width={40} height={40} />
          </span>
        </div>

        <div className="relative bg-white rounded-lg shadow-xl max-w-lg mx-1 p-10">
          <h1 className="my-3 font-bold text-center">Share Campaign</h1>
          <div className="h-3 flex justify-center ml-2">
            {copied && (
              <span className="text-green-500    mb-4 font-medium">
                Copied!
              </span>
            )}
          </div>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareCampaignModal;