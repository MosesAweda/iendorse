import React, { useState, useEffect, useCallback } from 'react';
import { ThreeCircles } from 'react-loader-spinner';
import Navbar from '../NavBar/Navbar';
import FeedCampaign from './FeedCampaign';
import { baseURL } from '../URL';
import useInfinitePagination from '../useInfinitePagination';
import {Link} from 'react-router-dom'

const Feed: React.FC = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const PAGE_SIZE = 10;

  const { 
    data: apiData, 
    loading, 
    error, 
    hasMore 
  } = useInfinitePagination<any>({
    url: `${baseURL}/Campaign/MyFeed`,
    pageNumber,
    pageSize: PAGE_SIZE
  });

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= 
      document.documentElement.offsetHeight - 100 && 
      !loading && 
      hasMore
    ) {
      setPageNumber(prev => prev + 1);
    }
  }, [loading, hasMore]);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Render no campaigns message
  const renderNoCampaigns = () => (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-24 w-24 text-gray-400 mb-4"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        No Campaigns Found
      </h2>
      <p className="text-gray-500 mb-4">
        You currently have no active campaigns.
      </p>
     
     <Link to="/CreateCampaign">
      <button 
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        // Add onclick handler to create a new campaign if needed
        // onClick={handleCreateCampaign}
      >
        Create New Campaign
      </button>
      </Link>
    </div>
  );

  return (
    <div className='bg-gray-100 min-h-screen'>
      <Navbar/>
      <div className="flex flex-col bg-gray-100 justify-center items-center">
        {/* No campaigns scenario */}
        {!loading && apiData.length === 0 && renderNoCampaigns()}

        {/* Campaigns list */}
        {apiData.map((item: any, index: number) => (
          <FeedCampaign key={index} item={item} />
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className='flex items-center justify-center'>  
            <ThreeCircles
              visible={true}
              height="40"
              width="40"
              color="#0D236E"
              ariaLabel="three-circles-loading"
            />
          </div>
        )}

        {/* Error handling */}
        {error && <p className="text-red-500">Error: {error.message}</p>}

        {/* No more items message */}
        {!hasMore && apiData.length > 0 && (
          <div className='text-center text-gray-500 mt-4'>
            No more items to load
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;