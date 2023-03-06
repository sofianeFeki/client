import { Typography, Box, Button } from '@mui/material';
import React, { useState, useEffect, useMemo } from 'react';
import { getUsers } from '../../../functions/auth';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { MainContainer } from '../../AppBar/Style';
import { useSelector } from 'react-redux';
import { grey } from '@mui/material/colors';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Support = () => {
  const [users, setUsers] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const { drawer } = useSelector((state) => ({ ...state }));
  const columns = useMemo(() => [
    { field: '_id', headerName: 'Id', width: 220 },
    { field: 'name', headerName: 'Name', width: 170 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'role', headerName: 'Role', width: 100 },
    { field: 'createdAt', headerName: 'created At', width: 200 },
  ]);

  useEffect(() => {
    loadUsers();
  }, []);
  const loadUsers = () => {
    getUsers().then((c) => setUsers(c.data));
  };
  return (
    <MainContainer open={drawer}>
      <Box sx={{ height: '100%', width: '100%', pl: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
          <Typography variant="h3" component="h3">
            Manage Users
          </Typography>
          <Box sx={{ height: '40px', mt: 2 }}>
            <Button variant="contained" startIcon={<PersonAddIcon />}>
              Ajouter un utilisateur
            </Button>
          </Box>
        </Box>
        <Box sx={{ height: 'calc(100vh - 150px)', width: '100%' }}>
          <DataGrid
            columns={columns}
            rows={users}
            getRowId={(row) => row._id}
            pageSize={pageSize}
            rowsPerPageOptions={[5, 10, 20]}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            getRowSpacing={(params) => ({
              top: params.isFirstVisible ? 0 : 5,
              bottom: params.isLastVisible ? 0 : 5,
            })}
            sx={{
              [`& .${gridClasses.row}`]: {
                bgcolor: (theme) =>
                  theme.palette.mode === 'light' ? grey[50] : grey[900],
              },
            }}
          />
        </Box>
      </Box>
    </MainContainer>
  );
};

export default Support;
