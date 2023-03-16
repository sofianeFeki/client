import React from 'react';

import { Link } from 'react-router-dom';

import { Box, Button, Typography } from '@mui/material';
import logo from '../../images/logo/logo.png';

const Auth = () => {
  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          textAlign: 'center',
        }}
      >
        {' '}
        <img src={logo} alt="Kompar logo" />
        <Box sx={{ m: 2 }}>
          <Typography variant="body1">
            Welcome to KomparCRM <br /> Log in with your kompar account to
            continue
          </Typography>
        </Box>
        <Button variant="contained" component={Link} to="/login">
          Log in
        </Button>
      </Box>
    </div>
  );
};

export default Auth;
