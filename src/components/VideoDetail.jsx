import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Typography, Box } from '@mui/material';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ReactPlayer from 'react-player';

import { useStateContext } from '../contexts/StateContextProvider';
import VideoItem from './VideoItem';
import Loader from './Loader';

const VideoDetail = () => {
  const { id } = useParams();
  const { retrieveNFTDetails } = useStateContext();
  const { isLoading, data } = useQuery(['NFTDetails', id], () =>
    retrieveNFTDetails(id)
  );
  const videoDetail = data?.nft.metadata;
  const videoSrc = videoDetail?.playbackId
    ? `https://cdn.livepeer.com/hls/${videoDetail?.playbackId}/index.m3u8`
    : videoDetail?.external_url;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box
      className="video-detail-container"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flex: 1,
          mt: 10,
        }}
      >
        <Box className="video-detail">
          <ReactPlayer className="video-card" controls url={videoSrc} />
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
            {videoDetail?.name}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ opacity: 0.7 }}>
              {/* <Typography sx={{ marginBottom: '5px' }}>
                  {parseInt(videoDetail?.statistics?.viewCount).toLocaleString(
                    'en-US'
                  )}{' '}
                  views
                </Typography> */}
              <Typography>
                {new Date(videoDetail?.updated_date).toLocaleDateString()}
              </Typography>
            </Box>

            {/* <Box
                sx={{
                  opacity: 0.7,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 3,
                }}
                className="like-dislike"
              >
                <Typography
                  sx={{
                    marginBottom: '5px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <ThumbUpAltOutlinedIcon />
                  <Typography>
                    {parseInt(
                      videoDetail?.statistics?.likeCount
                    ).toLocaleString('en-US')}
                  </Typography>
                </Typography>
                <Typography
                  sx={{
                    marginBottom: '5px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <ThumbDownAltOutlinedIcon />
                  <Typography>
                    {parseInt(
                      videoDetail?.statistics?.dislikeCount
                    ).toLocaleString('en-US')}
                  </Typography>
                </Typography>
              </Box>*/}
          </Box>
          <Typography>{videoDetail?.description}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoDetail;
