import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Typography,
  Box,
  Button,
  Popover,
  TextField,
  InputAdornment,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ReactPlayer from 'react-player';
import { ethers } from 'ethers';

import Loader from './Loader';
import { useStateContext } from '../contexts/StateContextProvider';
import { useWeb3Context } from '../contexts/Web3ContextProvider';

const VideoDetail = () => {
  const { id } = useParams();
  const { signer, address } = useWeb3Context();
  const { retrieveNFTDetails, videos, metisTube, loading } = useStateContext();
  const [videoStat, setVideoStat] = useState({});
  const [tipBtnEl, setTipBtnEl] = useState();
  const [tipAmount, setTipAmount] = useState();

  useEffect(async () => {
    if (!metisTube) {
      return;
    }

    await retrieveNFTDetails(id);

    const tokenStatistics = await metisTube.tokenStatistics(id);
    const vs = {
      likes: tokenStatistics.likes.toNumber(),
      dislikes: tokenStatistics.dislikes.toNumber(),
    };

    if (address) {
      vs.liked = await metisTube.likes(id, address);
      vs.disliked = await metisTube.dislikes(id, address);
    }

    setVideoStat(vs);
  }, [metisTube, id, address]);

  const openTipPop = (event) => {
    setTipBtnEl(event.currentTarget);
  };

  const closeTipPop = () => {
    setTipBtnEl(null);
  };

  async function sendTip() {
    if (!signer) {
      alert('Please connect wallet to perform this action');
      return;
    }

    signer.sendTransaction({
      to: await metisTube.ownerOf(id),
      value: ethers.utils.parseEther(tipAmount),
    });
  }

  async function likeVideo() {
    if (!signer) {
      alert('Please connect wallet to perform this action');
    }

    const vs = { ...videoStat, liked: !videoStat.liked };
    if (vs.liked) {
      vs.likes += 1;
    } else {
      vs.likes -= 1;
    }

    await metisTube.toggleLike(id, vs.liked);
    setVideoStat(vs);
  }

  async function dislikeVideo() {
    if (!signer) {
      alert('Please connect wallet to perform this action');
    }

    const vs = { ...videoStat, disliked: !videoStat.disliked };
    if (vs.disliked) {
      vs.dislikes += 1;
    } else {
      vs.dislikes -= 1;
    }

    await metisTube.toggleLike(id, vs.disliked);
    setVideoStat(vs);
  }

  const videoDetail = videos[id];
  const videoSrc = videoDetail?.metadata.playbackId
    ? `https://cdn.livepeer.com/hls/${videoDetail?.metadata.playbackId}/index.m3u8`
    : videoDetail?.metadata.video;

  if (loading) {
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
            {videoDetail?.metadata.name}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ opacity: 0.7 }}>
              <Typography>
                {new Date(videoDetail?.metadata.date).toLocaleDateString()}
              </Typography>
            </Box>

            <Box
              sx={{
                opacity: 0.7,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
              }}
              className="like-dislike"
            >
              <Button
                variant="outlined"
                startIcon={<AttachMoneyIcon />}
                onClick={openTipPop}
              >
                Tip
              </Button>
              <Typography
                sx={{
                  marginBottom: '5px',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  cursor: 'pointer',
                  gap: 1,
                }}
                onClick={likeVideo}
              >
                <ThumbUpAltOutlinedIcon
                  color={videoStat.liked ? 'primary' : ''}
                />
                <Typography>{videoStat.likes}</Typography>
              </Typography>
              <Typography
                sx={{
                  marginBottom: '5px',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  cursor: 'pointer',
                  gap: 1,
                }}
                onClick={dislikeVideo}
              >
                <ThumbDownAltOutlinedIcon
                  color={videoStat.disliked ? 'primary' : ''}
                />
                <Typography>{videoStat.dislikes}</Typography>
              </Typography>
            </Box>
          </Box>
          <Typography>{videoDetail?.metadata.description}</Typography>
        </Box>
      </Box>
      <Popover
        open={!!tipBtnEl}
        anchorEl={tipBtnEl}
        onClose={closeTipPop}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <TextField
          label="Amount"
          type="number"
          variant="filled"
          value={tipAmount}
          sx={{ m: 1, width: '200px' }}
          InputProps={{
            endAdornment: <InputAdornment position="end">METIS</InputAdornment>,
          }}
          onChange={(event) => setTipAmount(event.target.value)}
        />
        <Button
          sx={{
            top: '15px',
            mr: '5px',
          }}
          variant="outlined"
          onClick={sendTip}
        >
          Send
        </Button>
      </Popover>
    </Box>
  );
};

export default VideoDetail;
