import React, { useState } from "react";
import closeIcon from "../svg/close.svg";
import { baseURL } from "../URL";
import useFetch from "../Hooks/useFetch";
import { Backdrop, CircularProgress } from "@mui/material";

interface RegionModal {
  isOpen: boolean;
  onClose: () => void;
  onSelectRegion: (region: string | string[]) => void;
}

const RegionModal: React.FC<RegionModal> = ({ isOpen, onClose, onSelectRegion }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(true);
  const url = `${baseURL}/CampaignTargetAudience/GetAll`;
  const onSuccess = () => {};
  const onError = () => {};
  const { data: apiData, loading } = useFetch(url, "GET", onSuccess, onError);
  const Regions = apiData && apiData.length > 0 ? apiData[2].values : [];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectRegion = (region: string | string[]) => {
    onSelectRegion(region);
    resetModal();
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const resetModal = () => {
    // Reset modal states to initial values
    setSearchQuery("");
    setIsDropdownOpen(true);
    onClose();
  };

  const filteredRegions = Regions.filter((region: string) =>
    region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="relative p-4 w-full max-w-md">
        <div className="flex justify-center p-4">
          <span
            className="cursor-pointer text-black text-3xl font-semibold"
            onClick={resetModal}
          >
            <img src={closeIcon} alt="Close" width={40} height={40} />
          </span>
        </div>
        <div className="relative bg-white rounded-lg shadow overflow-hidden pb-10">
          <div className="p-4">
            <div className="flex justify-center mt-8 mb-3">
              <div className="w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search Region..."
                  className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-2 mb-2"
                />
                <button
                  type="button"
                  className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-left"
                  onClick={toggleDropdown}
                >
                  {searchQuery || "Select Region"}
                </button>
                {isDropdownOpen && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg max-h-40 shadow-lg overflow-y-auto">
                    {filteredRegions.length > 0 ? (
                      filteredRegions.map((region: string, index: number) => (
                        <li
                          key={index}
                          className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                          onClick={() => selectRegion(region)}
                        >
                          {region}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-gray-500">No regions found</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
            <button
              type="button"
              className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 mb-2"
              onClick={() => selectRegion(Regions)}
            >
              Select All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionModal;
