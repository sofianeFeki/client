import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { currentAdmin } from '../../functions/auth';
import logo from '../../images/logo/logo.png';
import { MainContainer } from '../AppBar/Style';
import { Typography } from '@mui/material';

const AdminRoute = () => {
  const { user, drawer } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      currentAdmin(user.token)
        .then((res) => {
          // console.log(res);
          setAuthorized(true);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !authorized) {
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
  }

  return <Outlet />;
};

export default AdminRoute;
