import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, CardContent, CardMedia } from '@mui/material';

const VideoItem = ({ metadata, id }) => {
  return (
    <Link
      to={`/video-details/${id}`}
      style={{ textDecoration: 'none' }}
      onClick={() => window.scrollTo(0, 0)}
    >
      <Card
        className="recipe-card"
        sx={{
          width: 400,
          height: 310,
          boxShadow: 'none',
          borderRadius: 0,
        }}
      >
        <CardMedia
          component="img"
          height="250"
          image={
            metadata?.thumbnail ||
            'https://i.pinimg.com/474x/30/88/a3/3088a3ebaf713600adacd00397ee410d.jpg'
          }
          alt="green iguana"
          sx={{ borderRadius: 2 }}
        />
        <CardContent>
          <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
            {metadata?.name}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default VideoItem;
