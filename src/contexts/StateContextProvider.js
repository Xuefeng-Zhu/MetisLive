import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMap } from 'react-use';

import { useWeb3Context } from './Web3ContextProvider';
import MetisTube from '../contracts/MetisTube';

const NFT_PORT_API = 'https://api.nftport.xyz/v0';
const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { provider, signer } = useWeb3Context();
  const [metisTube, setMetisTube] = useState();
  const [loading, setLoading] = useState(false);
  const [videos, { set: setVideo }] = useMap({});

  useEffect(async () => {
    if (!provider) {
      return;
    }

    setMetisTube(MetisTube(signer || provider));
  }, [provider, signer]);

  const retrieveContractNFT = async (pageNumber) => {
    setLoading(true);
    const blockStart = 53436 + 5000 * pageNumber;
    const blockEnd = 53436 + 5000 * (pageNumber + 1);
    const transfers = await metisTube.queryFilter(
      metisTube.filters.Transfer(),
      blockStart,
      blockEnd
    );
    setLoading(false);

    transfers.forEach(async (transfer) => {
      await retrieveNFTDetails(transfer.args.tokenId.toString());
    });
  };

  const retrieveNFTDetails = async (tokenId) => {
    setLoading(true);
    const metadata = await metisTube.tokenURI(tokenId);
    setLoading(false);

    setVideo(tokenId, { tokenId, metadata: JSON.parse(metadata) });
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

  const mintNFT = async (data, address) => {
    data.date = new Date();
    await metisTube.claimToken(address, JSON.stringify(data));
  };

  return (
    <StateContext.Provider
      value={{
        retrieveContractNFT,
        retrieveNFTDetails,
        createStream,
        uploadFile,
        mintNFT,
        videos,
        metisTube,
        loading,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
