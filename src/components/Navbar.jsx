import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box, Button } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';

import SearchBar from './SearchBar';

const Navbar = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        p: 2,
        pt: 1,
        borderBottom: '1px solid #e3e3e3',
        position: 'fixed',
        top: 0,
        left: 0,
        background: 'white',
        gap: '10',
        width: '100%',
        zIndex: 100,
      }}
    >
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Typography sx={{ fontSize: 25, color: 'red', fontWeight: 800 }}>
          D📺live
        </Typography>
      </Link>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '10',
        }}
      >
        <Link to="/upload" style={{ display: 'flex', textDecoration: 'none' }}>
          <Button sx={{ mr: 2 }} variant="outlined" startIcon={<UploadIcon />}>
            Upload
          </Button>
        </Link>

        <SearchBar />
      </Box>
    </Box>
  );
};

export default Navbar;
