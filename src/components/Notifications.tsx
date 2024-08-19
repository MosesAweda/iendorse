import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './NavBar/Navbar';
import dot from './svg/dot.svg';
import send from './svg/send.svg';
import bell from './svg/bell.svg'
import { baseURL } from './URL';
import { toast } from 'react-toastify';
import NotificationCard from './NotificationCard';

const Notifications = () => {
    const [isNotifications, setIsNotifications] = useState(true);
    const [loading, setLoading] = useState(false);
    const [infiniteLoading, setInfiniteLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [apiData, setApiData] = useState<any[]>([]);

    const showNotifications = () => {
        setIsNotifications(true);
    };

    const showEndorsements = () => {
        setIsNotifications(false);
    };


    const url = `${baseURL}/EndorseNotification/GetNotifications`

    const loadDefaultNotifications = async () => {
      
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
        loadDefaultNotifications();
    }, []);

    // useEffect(() => {
    //     const loadMoreNotifications= async () => {
    //         setInfiniteLoading(true);
    //         try {
    //             const response = await fetch( url, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${window.localStorage.getItem('token')}`
    //                 },
    //             });

    //             if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    //             const responseData = await response.json();
    //             setTotalRecords(responseData.totalRecords);
    //             setApiData((prev) => [...prev, ...responseData?.data || []]);
    //         } catch (err) {
    //             toast.error((err as Error).message);
    //         } finally {
    //             setInfiniteLoading(false);
    //         }
    //     };

    //     if (page > 1) loadmoredata();
    // }, [page]);



    // const handleScroll = () => {
    //     if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
    //         if (totalRecords > apiData.length) {
    //             setPage((prev) => prev + 1);
    //         }
    //     }
    // };

    // useEffect(() => {
    //     window.addEventListener("scroll", handleScroll);
    //     return () => window.removeEventListener("scroll", handleScroll);
    // }, [apiData]);






    return (
        <>
           <div className='bg-gray-100 min-h-screen'> 
            <Navbar />

            <div className="flex bg-gray-100 justify-center  ">
                <div className="flex flex-col mt-10 mx-3">
                    <div className="flex text-sm justify-between mb-3 bg-white rounded-lg py-3 px-10 ">
                        <div className="flex mr-5 items-center w-full">
                            <button 
                                className={`px-6 py-2 ${isNotifications ? 'bg-customBlue text-white' : 'bg-white text-gray-800'} rounded-md w-full`} 
                                onClick={showNotifications}
                            >
                                Notifications
                            </button>
                        </div>
                        <div className="flex items-center w-full">
                            <button 
                                className={`px-6 py-2 ${!isNotifications ? 'bg-customBlue text-white' : 'bg-white text-gray-800'} rounded-md w-full`} 
                                onClick={showEndorsements}
                            >
                                Endorsements
                            </button>
                        </div>
                    </div>

                    {/* Notifications */}
                    {isNotifications && (
              apiData?.map((item) => (

                //card
                    <NotificationCard  item={item} />
              ))
                    )}

                    {/* Endorsements */}
                    {!isNotifications && (
                        <div>
                        <div className="p-4 max-w-md border-gray-700 bg-white rounded-lg my-2">
                            <div className="flex items-center justify-between">
                                <div className="flex">
                                    <div className="mr-4 bg-red-500 rounded-full mx-1">
                                        <img src="/images/Avatar.png" width={45} height={45} alt="Avatar" className="" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg">
                                            Name
                                        </div>
                                        <div className="text-xs">
                                            <i>Title</i>
                                        </div>
                                    </div>
                                </div>
                                <div className="mouse-pointer">
                                    <img src={dot} alt="dot" />
                                </div>
                            </div>
                            <div className="my-2 pr-20">
                                <h1 className="font-medium">
                                    Endorsed Your Campaign  
                                </h1>
                                <div className="mt-2">
                                Campaign #4366728 has been endorsed with 30 units.
                             </div>

                           
                             <Link to={'/sendthankyou'}>
                        <div className="flex items-center my-5">
                            <img src={send} alt="send" className="mr-2" />
                            <span className='text-customBlue font-medium'>Send A Thank You</span>
                        </div>
                                </Link>
                            
                    

                                <p className="text-xs mt-10">
                                        18 June, 2024
                                    </p>
                            </div>
                        </div>
                           
                        </div>
                        
                    )}
                </div>
            </div>
            </div>
        </>
    );
};

export default Notifications;
