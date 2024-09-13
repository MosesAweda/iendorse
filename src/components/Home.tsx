import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThreeCircles, Puff } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import bg from '../../public/images/bg.svg';
import bell from './svg/bell.svg';
import home from './svg/home.svg';
import search from './svg/search.svg';
import plus from './svg/plus.svg';
import feed from './svg/feed.svg';
import account from './svg/account.svg';
import share from './svg/share.svg';
import endorse from './svg/endorse.svg';
import apple from './svg/apple.svg';
import playstore from './svg/playstore.svg';
import SkeletonCampaign from './SkeletonCampaign';
import Navbar from './NavBar/Navbar';
import HomeCampaign from './HomeCampaign';
import usePost from './Hooks/usePost';
import { baseURL } from './URL';
import { Skeleton } from '@mui/material';
import useFetch from './Hooks/useFetch';


interface ApiResponse {
  data: any;
  loading: boolean;
  error: Error | null;
  postData: (body: any) => Promise<void>;
  totalRecords: number;
}
const Home = () => {
  const [page, setPage] = useState(1);
  const [dataArray, setDataArray] = useState<any[]>([]);
  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const [categoryId, setCategoryId] = useState<any>(0);

  const onSuccess = () => {
    // setDataArray((prev) => [...prev, ...responseData?.data || []]);
  };
  
  const onError = () => {
    // console.log("error");
  };

  const requestURL = `${baseURL}/Category/GetCategories/`;
  const { data: categories, refreshApi: refreshCategories, error: categoriesError, loading: categoriesLoading } = useFetch(requestURL, "GET", onSuccess, onError);

  const discoverURL = `${baseURL}/Campaign/DiscoverCampaign?CategoryId=${categoryId}&pageNumber=${page}&pageSize=20`;
  const { data, loading, error, postData } = usePost<ApiResponse>(discoverURL);
  const totalRecords = data?.totalRecords || 0;

  // Fetch data based on the current category and page
  useEffect(() => {
    postData({});
  }, [categoryId, page]);

  // Fetch data and handle infinite scroll
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(discoverURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const responseData = await response.json();
        const fetchedData = responseData?.data || [];

        // If category changes, reset data array, otherwise append new data
        if (page === 1) {
          setDataArray(fetchedData);
        } else {
          setDataArray((prev) => [...prev, ...fetchedData]);
        }
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setInfiniteLoading(false);
      }
    };

    fetchCampaigns();
  }, [page, categoryId]);

  // Handle infinite scroll// Handle infinite scroll
const handleScroll = () => {
  if (infiniteLoading || dataArray.length >= totalRecords) return;  // Stop if already loading or all records are loaded

  if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
    if (dataArray.length < totalRecords) {
      setInfiniteLoading(true);
      setPage((prev) => prev + 1);
    } else {
      console.log("All records loaded:", totalRecords, dataArray.length);
    }
  }
};


  // Handle category change
  const handleCategoryChange = (newCategoryId: any) => {
    setPage(1); // Reset to the first page
    setDataArray([]); // Clear the existing data
    setCategoryId(newCategoryId); // Update the selected category
    setInfiniteLoading(false); // Reset infinite loading state
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dataArray.length, totalRecords]);


  return (
    <>
      <Navbar />

      <div
        className="hidden sm:block flex flex-col w-full h-screen"
        style={{
          backgroundImage: 'url(images/hero.png)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          margin: 0,
          padding: 0,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 h-full gap-4 p-4">
          <div className="flex justify-center items-center p-2">
            <div className="mx-3 max-w-md">
              <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "Georgia" }}>
                Discover, Endorse, Transform
              </h1>
              <p className="text-sm md:text-base leading-relaxed">
                Dive into our platform to discover a world of impactful campaigns, each one a beacon of hope, a catalyst for transformation.
                With iEndorse, you have the power to endorse causes close to your heart, amplifying their reach and influence.
                Every endorsement is a vote for change, a commitment to shaping a better tomorrow for all.
              </p>
              <div className='flex mt-8'>
                <Link to='/'>
                  <button className='p-1 bg-customBlue text-white rounded-lg px-5 mr-4'>
                    <div className='flex items-center'>
                      <img src={apple} alt="Download on the App Store" width={20} height={20} />
                      <div className='ml-2 text-xs'>
                        <div>Download on the</div>
                        <div>App Store</div>
                      </div>
                    </div>
                  </button>
                </Link>
                <Link to='/'>
                  <button className='p-1 bg-customBlue text-white rounded-lg px-5'>
                    <div className='flex items-center'>
                      <img src={playstore} alt="Get it on Google Play" width={20} height={20} />
                      <div className='ml-2 text-xs'>
                        <div>Get it on</div>
                        <div>Google Play</div>
                      </div>
                    </div>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div 
  style={{
    background: 'radial-gradient(circle, rgba(194,192,227,1) 30%, rgba(194,192,227,1) 36%, rgba(255,255,255,1) 66%)',
    backgroundRepeat: 'no-repeat', 
    backgroundSize: 'cover', 
    margin: 0, 
    padding: 0, 
    // height: '100vh', // Ensure the container takes full viewport height
    
    flexDirection: 'column', // Stack children vertically
    justifyContent: 'flex-end' // Align children to the bottom
  }} 
  className="flex flex-col justify-center items-center text-xs  sm:hidden ">
  
  <img 
    src='images/mobileHero.png' 
    alt='hero' 
    className='w-full'
    style={{ 
      objectFit: 'cover', // Ensure the image covers its container
      objectPosition: 'bottom' // Align the image to the bottom of its container
    }} 
  />

  
  
  <div className='bg-white'> 
    
  <div className='flex mt-2 justify-center sm:hidden'>
                <Link to='/'>
                  <button className=' bg-customBlue text-white rounded-lg px-3 mr-4'>
                    <div className='flex items-center px-10'>
                      <img src={apple} alt="Download on the App Store" width={32} height={32} />
                      <div className=' text-start ml-3 text-sm py-4'>
                        <div>Download on the</div>
                        <div>App Store</div>
                      </div>
                    </div>
                  </button>
                </Link>
                <Link to='/'>
                  <button className='bg-customBlue text-white rounded-lg px-5'>
                    <div className='flex items-center px-10'>
                      <img src={playstore} alt="Get it on Google Play" width={35} height={35} />
                      <div className=' text-start ml-2 text-sm py-4'>
                        <div>Get it on</div>
                        <div>Google Play</div>
                      </div>
                    </div>
                  </button>
                </Link>
        </div>
    <div className='font-bold text-3xl p-2 px-3 mt-4 mx-2'>
      Discover, Endorse, Transform
    </div>
    <div className='p-2 px-2 text-sm text-base text-justify leading-relaxed mx-4'>
      Dive into our platform to discover a world of impactful campaigns, each 
      one a beacon of hope, a catalyst for transformation. With iEndorse, you have 
      the power to endorse causes close to your heart, amplifying their reach and 
      influence. Every endorsement is a vote for change, a commitment to shaping 
      a better tomorrow for all.
    </div>



  </div>
    </div>



    <div className="flex flex-wrap justify-center p-4 text-xs bg-white sm:bg-gray-100">
  {categories?.map((item: any) => (
    <button 
      key={item.id} 
      className={`px-5 py-2 m-2 rounded-full text-white 
        ${item.id === categoryId ? 'bg-blue-800' : 'bg-customBlue hover:bg-blue-900'}`}
      onClick={() => handleCategoryChange(item.id)}
    >
      {item.categoryName}
    </button>
  ))}
    </div>


      <div className="flex flex-col bg-white sm:bg-gray-100 justify-center items-center overflow-x-hidden">
      {/* {error && <p>Error: {error.message}</p>} */}
      {loading && !infiniteLoading ? (
  // Display the loading skeleton while data is being fetched
  <SkeletonCampaign />
) : dataArray.length === 0 ? (
  // Display a message when there's no data
  <div className="text-center text-gray-500 mt-4 mb-20">
    {!loading && !infiniteLoading && <p>No campaigns found.</p>}
  </div>
) : (
  // Display the actual content once loading is complete
  <>
    {dataArray.map((item, index) => (
      <HomeCampaign key={index} item={item} />
    ))}
    {dataArray.length >= totalRecords && (
      <div className="text-center text-gray-500 mt-4 mb-20">
        <p>You have reached the end of the campaigns.</p>
      </div>
    )}
  </>
)}



        {infiniteLoading && (
          <div className="flex items-center mt-4 justify-center">
            <Puff color='#0D236E'  height="40"
              width="40" />
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
