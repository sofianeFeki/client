import React, { useMemo, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Avatar, Tooltip, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dashboard,
  Headphones,
  Logout,
  ManageAccounts,
  PostAdd,
  SupervisorAccount,
  SupportAgent,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../sevices/firebase';
import { signOut } from 'firebase/auth';
import Admin from '../pages/admin';
import Quality from '../pages/quality';
import Support from '../pages/support';
import WelcomeCall from '../pages/wc';
import ContractsList from '../pages/admin/ContractsList';
import { DrawerHeader } from './Style';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const SideList = ({ drawer }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const history = useNavigate();
  const location = useLocation();
  const list = useMemo(
    () => [
      {
        title: 'Admin',
        icon: <Dashboard />,
        link: '/admin',
      },
      {
        title: 'Back office',
        icon: <PostAdd />,
        link: '/back-office',
      },
      {
        title: 'SAV',
        icon: <SupervisorAccount />,
        link: '/sav',
      },
      {
        title: 'Quality',
        icon: <Headphones />,
        link: '/quality',
      },
      {
        title: 'Support',
        icon: <ManageAccounts />,
        link: '/support',
      },
      {
        title: 'welcome call',
        icon: <SupportAgent />,
        link: '/welcome-call',
      },
    ],
    []
  );
  async function logout() {
    await signOut(auth);
    dispatch({
      type: 'LOGOUT',
      payload: null,
    });
    history('/login');
  }

  const handleClose = () => {
    dispatch({
      type: 'SET_OPEN',
      payload: false,
    });
  };
  return (
    <>
      {user && (
        <Drawer variant="permanent" open={drawer}>
          <DrawerHeader>
            <IconButton onClick={handleClose}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
          <Divider />

          <List>
            {list.map((item) => (
              <ListItem
                key={item.title}
                disablePadding
                sx={{ display: 'block' }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: drawer ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  onClick={() => history(item.link)}
                  selected={location.pathname === item.link}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: drawer ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    sx={{ opacity: drawer ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ mx: 'auto', mt: 3, mb: 1 }}>
            <Tooltip title={user?.name || 'name'}>
              <Avatar
                src=""
                {...(drawer && { sx: { width: 100, height: 100 } })}
              />
            </Tooltip>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            {drawer && <Typography>{user?.name || 'name'}</Typography>}
            <Typography variant="body2">{user?.role || 'role'}</Typography>
            {drawer && (
              <Typography variant="body2">{user?.email || 'name'}</Typography>
            )}
            <Tooltip title="LOGOUT" sx={{ mt: 1 }}>
              <IconButton onClick={logout}>
                <Logout />
              </IconButton>
            </Tooltip>
          </Box>
        </Drawer>
      )}

      <DrawerHeader />
    </>
  );
};

export default SideList;
