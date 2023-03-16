import { Box, Typography } from '@mui/material';
import React from 'react';
import { MainContainer } from '../AppBar/Style';
import logo from '../../images/logo/logo.png';
import { useSelector } from 'react-redux';

const Missing = () => {
  const { drawer } = useSelector((state) => ({ ...state }));
  return (
    <MainContainer open={drawer}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <img src={logo} alt="Kompar logo" />
        <Box sx={{ m: 2 }}>
          <Typography variant="body1">
            Sorry, you are not authorized to access this resource.
          </Typography>
        </Box>
      </Box>
    </MainContainer>
  );
};

export default Missing;
