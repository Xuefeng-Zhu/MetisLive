import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box, Button, Menu, MenuItem } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import SearchBar from './SearchBar';
import { useWeb3Context } from '../contexts/Web3ContextProvider';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { loadWeb3Modal, logoutOfWeb3Modal, address } = useWeb3Context();

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
          Metis📺Live
        </Typography>
      </Link>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '10',
          marginRight: '10px',
        }}
      >
        {address ? (
          <Link
            to="/upload"
            style={{ display: 'flex', textDecoration: 'none' }}
          >
            <Button
              sx={{ mr: 2 }}
              variant="outlined"
              startIcon={<UploadIcon />}
              onContextMenu={(event) => {
                event.preventDefault();
                setAnchorEl(event.currentTarget);
              }}
            >
              Upload
            </Button>
          </Link>
        ) : (
          <Button
            sx={{ mr: 2 }}
            variant="outlined"
            startIcon={<AccountBalanceWalletIcon />}
            onClick={loadWeb3Modal}
          >
            Connect to wallet
          </Button>
        )}
        <Menu
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={() => {
            setAnchorEl(null);
          }}
        >
          <MenuItem
            onClick={() => {
              logoutOfWeb3Modal();
              setAnchorEl(null);
            }}
          >
            Logout
          </MenuItem>
        </Menu>
        {/* <SearchBar /> */}
      </Box>
    </Box>
  );
};

export default Navbar;
