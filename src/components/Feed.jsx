import React from 'react';
import { Box } from '@mui/material';
import { useQuery } from 'react-query';

import { useStateContext } from '../contexts/StateContextProvider';
import VideoItem from './VideoItem';
import Loader from './Loader';

const Feed = () => {
  const { retrieveContractNFT } = useStateContext();
  const { isLoading, data } = useQuery('contractNFT', () =>
    retrieveContractNFT(1)
  );

  if (isLoading) {
    return <Loader />;
  }

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
        {data?.nfts.map(({ metadata, token_id }) => (
          <VideoItem metadata={metadata} id={token_id} key={token_id} />
        ))}
      </Box>
    </Box>
  );
};

export default Feed;
