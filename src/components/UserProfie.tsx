import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './NavBar/Navbar';
import dot from './svg/dot.svg';
import send from './svg/send.svg';
import bell from './svg/bell.svg'
import search from './svg/search.svg'
import arrow_left from './svg/arrow_left.svg'
import { baseURL } from './URL';
import { toast } from 'react-toastify';
import { Puff } from 'react-loader-spinner';

const UserProfile = () => {
    const userData:any = window.localStorage.getItem("userData");
    const parsedUserData = JSON.parse(userData);
    const token = userData ? JSON.parse(userData).jwtToken : null;
    const [loading, setLoading] = useState(false);
    const [infiniteLoading, setInfiniteLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [formError, setFormError] = useState<string>("");
    const [searchMode, setSearchMode] = useState(false);
    const [apiData, setApiData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalRecords, setTotalRecords] = useState<number>(0);

    const url = `${baseURL}/Campaign/MyCampaigns`

    const loadDefaultData = async () => {
        setSearchMode(false);
        setLoading(true);
        try {
            const response = await fetch(url, {
                method: 'GET',
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


    useEffect(() => {
        loadDefaultData();
    }, []);

    useEffect(() => {
        const loadmoredata = async () => {
            setInfiniteLoading(true);
            try {
                const response = await fetch( url, {
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

        if (page > 1) loadmoredata();
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


    console.log("api data", apiData)
    return (
        <div className='bg-gray-100 min-h-screen'>
            <Navbar />
              <div className=" bg-gray-100 px-10 pt-10 mb-20 ">
                <div className="relative mt-16  max-w-2xl mx-auto mt-24 rounded-lg   ">
                  <div className="rounded-3xl overflow-hidden shadow-md bg-white">
                    <div className="absolute -mt-20 w-full flex justify-center">
                      <div className="h-32 w-32">
                        <img
                          src=""
                          className="rounded-full object-cover h-full w-full shadow-md"
                        />
                      </div>
                    </div>
                    <div className="px-6 mt-16 pb-12">
                      <h1 className="font-bold text-3xl text-center mb-1"> {parsedUserData.fullName}</h1>
                      <p className="text-gray-800 text-sm text-center">
                        {parsedUserData.occupation}
                      </p>
                    
                    </div>
                  </div>
                </div>
              </div>


              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-4 sm:mx-32 mx-10">
                        {apiData && apiData.map((item: any, index: number) => (
                            <Link to={`/ViewCampaign/${item?.campaignId}`} > 
                            
                            <div
                                className="max-w-200 mb-4 h-400 grid rounded-lg border border-gray-200 shadow"
                                key={index}
                                style={{
                                   // backgroundColor: 'rgba(0, 0, 5, 0.9)',
                                    backgroundColor: 'rgba(255, 255, 255, 1)',
                                    backgroundImage:`url(${item?.campaignImage})` ,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    height: 200,
                                }}
                            >
                                <div className='grid flex items-end'>
                                    <div 
                                        style={{
                                            backgroundImage: `linear-gradient(180deg, rgba(255, 255, 242, 0.00) 12%, rgba(242, 242, 242, 0.08) 14.58%, rgba(242, 242, 242, 0.78) 50%, #F2F2F2 70.83%, #F2F2F2 83.33%, #F2F2F2 100%)`
                                        }}>   
                                        <div className={"flex items-center justify-start pr-4 pl-2 pt-8 mb-2  "}>
                                            <div className="mr-1 rounded-full mx-1">
                                                <img src="/images/Avatar.png" width={30} height={30} alt="Avatar" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-xs" style={{ fontSize: '10px' }}>
                                                    {item?.campaignTitle}
                                                </div>
                                                <div className='text-xs mt-0' style={{ fontSize: '7px' }}>
                                                    <i>{item?.description}</i>
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

            </div>
        );
};

export default UserProfile;
