import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';

const NFT_CONTRACT = '0x43c97b241cD64805BD3066F5b38369aBcE311921';
const NFT_PORT_API = 'https://api.nftport.xyz/v0';
const StateContext = createContext();
const baseUrl = 'https://www.googleapis.com/youtube/v3';

export const StateContextProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const fetchData = async (url) => {
    setLoading(true);
    const data = await axios.get(`${baseUrl}/${url}`, {
      params: {
        key: process.env.REACT_APP_API_KEY,
        maxResults: 50,
      },
    });

    setData(data?.data?.items);
    setLoading(false);
  };

  const fetchOtherData = async (url) => {
    const data1 = await axios.get(`${baseUrl}/${url}`, {
      params: {
        key: process.env.REACT_APP_API_KEY,
        maxResults: 50,
        regionCode: 'IN',
      },
    });
    setResults(data1?.data?.items);
  };

  const uploadFile = async (file) => {
    const data = new FormData();
    data.append('file', file);

    const options = {
      method: 'POST',
      url: `${NFT_PORT_API}/files`,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: process.env.REACT_APP_NFT_PORT_API_KEY,
        'content-type':
          'multipart/form-data; boundary=---011000010111000001101001',
      },
      data,
    };

    return axios.request(options).then(function (response) {
      return response.data;
    });
  };

  const uploadMetadata = async (data) => {
    const options = {
      method: 'POST',
      url: `${NFT_PORT_API}/metadata`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.REACT_APP_NFT_PORT_API_KEY,
      },
      data,
    };

    return axios.request(options).then(function (response) {
      return response.data;
    });
  };

  const mintNFT = async (data) => {
    const metadata = await uploadMetadata(data);

    const options = {
      method: 'POST',
      url: `${NFT_PORT_API}/mints/customizable`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.REACT_APP_NFT_PORT_API_KEY,
      },
      data: {
        chain: 'polygon',
        contract_address: NFT_CONTRACT,
        metadata_uri: metadata.metadata_uri,
        mint_to_address: '0x69Dc1267198e2D21B56Ef0f1C6BcC57d96A7ED4B',
      },
    };

    return axios.request(options).then(function (response) {
      return response.data;
    });
  };

  const retrieveContractNFT = async (pageNumber) => {
    const options = {
      method: 'GET',
      url: `${NFT_PORT_API}/nfts/${NFT_CONTRACT}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.REACT_APP_NFT_PORT_API_KEY,
      },
      params: { chain: 'polygon', include: 'all', page_number: pageNumber },
    };

    return axios.request(options).then(function (response) {
      return response.data;
    });
  };

  const retrieveNFTDetails = async (tokenId) => {
    const options = {
      method: 'GET',
      url: `${NFT_PORT_API}/nfts/${NFT_CONTRACT}/${tokenId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.REACT_APP_NFT_PORT_API_KEY,
      },
      params: { chain: 'polygon' },
    };

    return axios.request(options).then(function (response) {
      return response.data;
    });
  };

  return (
    <StateContext.Provider
      value={{
        fetchData,
        fetchOtherData,
        retrieveContractNFT,
        retrieveNFTDetails,
        uploadFile,
        uploadMetadata,
        mintNFT,
        results,
        data,
        loading,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
