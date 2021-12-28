import React, { useEffect } from 'react';
import { Box } from '@mui/material';

import VideoItem from './VideoItem';
import Loader from './Loader';
import { useStateContext } from '../contexts/StateContextProvider';

const Feed = () => {
  const { retrieveContractNFT, videos, metisTube, loading } = useStateContext();
  useEffect(async () => {
    if (!metisTube) {
      return;
    }

    await retrieveContractNFT(1);
  }, [metisTube]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          p: 1,
          mt: 10,
        }}
      >
        {Object.values(videos).map(({ metadata, tokenId }) => (
          <VideoItem metadata={metadata} id={tokenId} key={tokenId} />
        ))}
        {loading && <Loader />}
      </Box>
    </Box>
  );
};

export default Feed;
