import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';

const NFT_CONTRACT = '0x43c97b241cD64805BD3066F5b38369aBcE311921';
const NFT_PORT_API = 'https://api.nftport.xyz/v0';
const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
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

  const createStream = async (name) => {
    const options = {
      method: 'POST',
      url: 'https://livepeer.com/api/stream',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_LIVEPEER_API_KEY}`,
      },
      data: {
        name,
        profiles: [
          {
            name: '720p',
            bitrate: 2000000,
            fps: 30,
            width: 1280,
            height: 720,
          },
          {
            name: '480p',
            bitrate: 1000000,
            fps: 30,
            width: 854,
            height: 480,
          },
          {
            name: '360p',
            bitrate: 500000,
            fps: 30,
            width: 640,
            height: 360,
          },
        ],
      },
    };

    return axios.request(options).then(function (response) {
      return response.data;
    });
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

  const mintNFT = async (data, address) => {
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
        mint_to_address: address,
      },
    };

    return axios.request(options).then(function (response) {
      return response.data;
    });
  };

  return (
    <StateContext.Provider
      value={{
        retrieveContractNFT,
        retrieveNFTDetails,
        createStream,
        uploadFile,
        uploadMetadata,
        mintNFT,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
