import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThreeCircles, Puff } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import Navbar from './NavBar/Navbar';
import searchIcon from './svg/search.svg';
import closeIcon from './svg/close.svg';
import arrowLeftIcon from './svg/arrow_left.svg';
import { baseURL } from './URL';

const Search = () => {
    const [isCampaigns, setIsCampaigns] = useState(true);
    const [loading, setLoading] = useState(false);
    const [infiniteLoading, setInfiniteLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [formError, setFormError] = useState<string>("");
    const [searchMode, setSearchMode] = useState(false);
    const [apiData, setApiData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalRecords, setTotalRecords] = useState<number>(0);

    const discoverURL = `${baseURL}/Campaign/DiscoverCampaign?pageNumber=${page}&pageSize=10`;
    const searchURL = `${baseURL}/Campaign/SearchCampaign?pageNumber=${page}&pageSize=2&searchTerm=${searchQuery}`;

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setFormError("");
    };

    const loadDefaultData = async () => {
        setSearchMode(false);
        setLoading(true);
        try {
            const response = await fetch(discoverURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.localStorage.getItem('token')}`
                },
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const responseData = await response.json();
            setTotalRecords(responseData.totalRecords);
            setApiData(responseData?.data || []);
        } catch (err) {
            toast.error((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!searchQuery.trim()) {
            setFormError("Please enter a search term");
            return;
        }
        setSearchMode(true);
        setLoading(true);

        try {
            const response = await fetch(searchURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.localStorage.getItem('token')}`
                },
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const responseData = await response.json();
            setApiData(responseData?.data || []);
        } catch (err) {
            toast.error((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setPage(1);
        setSearchMode(false);
        setSearchQuery("");
        loadDefaultData();
    };

    useEffect(() => {
        loadDefaultData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setInfiniteLoading(true);
            try {
                const response = await fetch(searchMode ? searchURL : discoverURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${window.localStorage.getItem('token')}`
                    },
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const responseData = await response.json();
                setTotalRecords(responseData.totalRecords);
                setApiData((prev) => [...prev, ...responseData?.data || []]);
            } catch (err) {
                toast.error((err as Error).message);
            } finally {
                setInfiniteLoading(false);
            }
        };

        if (page > 1) fetchData();
    }, [page]);

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
            if (totalRecords > apiData.length) {
                setPage((prev) => prev + 1);
            }
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [apiData]);

    return (
        <div className='bg-gray-100 min-h-screen'>
            <Navbar />
            <div className='flex justify-center mt-8 mb-3 mx-3'>
                <div className='relative w-1/2'>
                    <form onSubmit={handleSubmit} className=''>
                        <input 
                            type='text'
                            value={searchQuery}
                            onChange={handleSearch}
                            className={`w-full bg-white border ${formError ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 pl-10`} 
                            placeholder='Search' 
                        />
                        <img 
                            src={searchIcon} 
                            onClick={handleSubmit}
                            className='absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer'
                            width={16} height={16}
                            alt="Search"
                        />
                        {searchQuery && (
                            <img 
                                src={closeIcon} 
                                onClick={clearSearch}
                                className='absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer'
                                width={16} height={16}
                                alt="Clear"
                            />
                        )}
                    </form>
                </div>
            </div>
            {formError && <div className='text-red-500 flex justify-center '>{formError}</div>}

            <div className='flex justify-center mt-8 mb-10 mx-3'>
                <div className="flex text-sm justify-center mb-3 bg-white rounded-lg py-2 px-10">
                    <button
                        className={`px-6 py-2 ${isCampaigns ? 'bg-customBlue text-white' : 'bg-white text-gray-800'} rounded-md w-full`}
                        onClick={() => setIsCampaigns(true)}
                    >
                        Campaigns
                    </button>
                    <button
                        className={`px-6 py-2 ${!isCampaigns ? 'bg-customBlue text-white' : 'bg-white text-gray-800'} rounded-md w-full`}
                        onClick={() => setIsCampaigns(false)}
                    >
                        Accounts
                    </button>
                </div>
            </div>

            {loading ? (
                <div className='flex items-center justify-center h-screen'>
                    <ThreeCircles height="40" width="40" color="#0D236E" />
                </div>
            ) : (
                isCampaigns ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-4 sm:mx-32 mx-10">
                        {apiData && apiData.map((item: any, index: number) => (
                            <Link to={`/ViewCampaign/${item?.campaignId}`} > 
                            <div
                                className="max-w-200 mb-4 h-400 grid rounded-lg border border-gray-200 shadow"
                                key={index}
                                style={{
                                    // backgroundColor: 'rgba(0, 0, 5, 0.9)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    backgroundImage: searchMode ? `url(${item?.filePath})` : `url(${item?.campaignFiles[0]?.filePath})`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    height: 200,
                                }}
                            >
                                <div className='grid flex items-end'>
                                    <div 
                                        style={{
                                            backgroundImage: `linear-gradient(180deg, rgba(242, 242, 242, 0.00) 0%, rgba(242, 242, 242, 0.08) 14.58%, rgba(242, 242, 242, 0.78) 50%, #F2F2F2 70.83%, #F2F2F2 83.33%, #F2F2F2 100%)`
                                        }}>   
                                        <div className="flex items-center justify-start pr-4 pl-2 pt-8 mb-4">
                                            <div className="mr-1 rounded-full mx-1">
                                                <img src="/images/Avatar.png" width={30} height={30} alt="Avatar" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-xs" style={{ fontSize: '10px' }}>
                                                    {item?.campaignOwner}
                                                </div>
                                                <div className='text-xs mt-0' style={{ fontSize: '7px' }}>
                                                    <i>{item?.campaignOwnerTitle}</i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </Link>
                        ))}
                 



                 { infiniteLoading && (
                    <>          
                    <div className='flex justify-center items-center'>
                    <p>   
                        <Puff
                            visible={true}
                            height="30"
                            width="30"
                            color="#0D236E"
                            ariaLabel="puff-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            />

                             
                            </p>
                    </div>
                    </>
                 )}
                    </div>
                    

               
                ) : (
                    <div className='flex justify-center'>
                        <div className='bg-white p-10 w-full mx-1 sm:w-3/4 rounded-md mb-10'>
                            <div className="flex items-center justify-between my-8 mx-1">
                                <div className="flex">
                                    <div className="mr-4 rounded-full mx-1">
                                        <img src="/images/Avatar.png" width={45} height={45} alt="Avatar" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg">Poster</div>
                                        <div className="text-xs">
                                            <span>Human Right Activist</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-1 cursor-pointer">
                                    <img   alt="Report" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between my-8 mx-1">
                                <div className="flex">
                                    <div className="mr-4 rounded-full mx-1">
                                        <img src="/images/Avatar.png" width={45} height={45} alt="Avatar" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg">Poster</div>
                                        <div className="text-xs">
                                            <p>Human Right Activist</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-1 cursor-pointer">
                                    <img   alt="Report" />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default Search;
