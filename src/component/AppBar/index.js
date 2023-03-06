import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../sevices/firebase';
import { signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useMemo, useState } from 'react';
import SideList from './SideList';
import { light } from '@mui/material/styles/createPalette';
import { Brightness7, Brightness4 } from '@mui/icons-material';
//import Brightness7Icon from '@mui/icons-material/Brightness7';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function KomparAppBar({ setDark, dark }) {
  const { drawer } = useSelector((state) => ({ ...state }));
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));
  const history = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = async () => {
    setAnchorElUser(null);
  };

  async function logout() {
    setAnchorElUser(null);
    await signOut(auth);
    dispatch({
      type: 'LOGOUT',
      payload: null,
    });
    history('/login');
  }

  const handleDrawerOpen = () => {
    dispatch({
      type: 'SET_OPEN',
      payload: true,
    });
  };

  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };

  return (
    <>
      {user && (
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="fixed" open={drawer}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(drawer && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1 }}
              >
                Kompar Dashboard
              </Typography>
              <IconButton onClick={() => setDark(!dark)}>
                {dark ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Toolbar>
          </AppBar>
          <SideList {...{ drawer }} />
        </Box>
      )}
    </>
  );
}
