// import { Box, Typography } from '@mui/material';
// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { MainContainer } from '../../AppBar/Style';
// import { TextField } from '@mui/material';
// import InputAdornment from '@mui/material/InputAdornment';
// import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

// const WelcomeCall = () => {
//   const dispatch = useDispatch();
//   const { search, drawer } = useSelector((state) => ({ ...state }));
//   const { text } = search;
//   const history = useNavigate();
//   const handleChange = (e) => {
//     dispatch({
//       type: 'SEARCH_QUERY',
//       payload: { text: e.target.value },
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     history(`/contract/${text}`);
//   };
//   return (
//     <MainContainer open={drawer}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
//         <Typography variant="h3" component="h3">
//           Search Contract
//         </Typography>
//       </Box>
//       <Box sx={{ px: 2 }}>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             type="search"
//             label="search"
//             sx={{ my: 2, width: '100%' }}
//             variant="outlined"
//             size="small"
//             fullWidth
//             value={text}
//             onChange={handleChange}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="end">
//                   <SearchOutlinedIcon />
//                 </InputAdornment>
//               ),
//             }}
//           />
//         </form>
//       </Box>
//     </MainContainer>
//   );
// };

// export default WelcomeCall;

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridActionsCellItem,
  gridClasses,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { MainContainer } from '../../AppBar/Style';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { getContractsSav } from '../../../functions/product';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import moment from 'moment';

function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ justifyContent: 'space-between' }}>
      <Box>
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
      </Box>
      <Box>
        <GridToolbarQuickFilter />
      </Box>
    </GridToolbarContainer>
  );
}

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  '& .ant-empty-img-1': {
    fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
  },
  '& .ant-empty-img-2': {
    fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
  },
  '& .ant-empty-img-3': {
    fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
  },
  '& .ant-empty-img-4': {
    fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
  },
  '& .ant-empty-img-5': {
    fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
    fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        width="120"
        height="100"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse
              className="ant-empty-img-5"
              cx="67.797"
              cy="106.89"
              rx="67.797"
              ry="12.668"
            />
            <path
              className="ant-empty-img-1"
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            />
            <path
              className="ant-empty-img-2"
              d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            />
            <path
              className="ant-empty-img-3"
              d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
            />
          </g>
          <path
            className="ant-empty-img-3"
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
          />
          <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
      </svg>
      <Box sx={{ mt: 1 }}>
        utiliser la barre de recherche pour trouver un contrat
      </Box>
    </StyledGridOverlay>
  );
}
// const initialState = JSON.parse(localStorage.getItem('quickFilterValue')) || [];

export default function Sav() {
  const { drawer } = useSelector((state) => ({ ...state }));
  const [quickFilterValue, setQuickFilterValue] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const columns = useMemo(() => [
    { headerName: 'clientRef ', field: 'clientRef', flex: 1.4 },
    { headerName: 'Civility', field: 'Civility', flex: 0.7 },
    { headerName: 'Prénom ', field: 'Prénom', flex: 1 },
    { headerName: 'Nom ', field: 'Nom', flex: 1 },
    { headerName: 'tel', field: 'tel', flex: 1 },
    { headerName: 'Énergie', field: 'Énergie', flex: 1 },
    { headerName: 'partenaire ', field: 'partenaire', flex: 1.3 },

    {
      headerName: 'date signature ',
      field: 'date_signature',
      flex: 1.25,
      renderCell: (params) => moment(params.value).format('DD/MM/YYYY HH:mm'),
      type: 'date',
    },
    {
      field: 'actions',
      type: 'actions',
      flex: 0.5,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="open"
          component={Link}
          to={`/contract/${params.row.contratRef}`}
        />,
      ],
    },
  ]);

  // useEffect(() => {
  //   localStorage.setItem('quickFilterValue', JSON.stringify(quickFilterValue));
  // }, [quickFilterValue]);

  const loadData = () => {
    setLoading(true);
    getContractsSav(quickFilterValue)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    loadData();
  }, [quickFilterValue]);

  const onFilterChange = useCallback((filterModel) => {
    // Here you save the data you need from the filter model
    if (filterModel && filterModel.quickFilterValues) {
      const quickFilterValue = filterModel.quickFilterValues;
      setQuickFilterValue(quickFilterValue);
      console.log(quickFilterValue);
    }
  }, []);
  return (
    <MainContainer open={drawer}>
      <Box sx={{ height: '100%', width: '100%', pl: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'start', py: 2 }}>
          <Typography variant="h3" component="h3">
            Manage Contracts sav
          </Typography>
        </Box>
        <Box sx={{ height: 'calc(100vh - 150px)', width: '100%' }}>
          <DataGrid
            loading={loading}
            disableColumnFilter
            components={{
              NoRowsOverlay: CustomNoRowsOverlay,
              Toolbar: CustomToolbar,
            }}
            columns={columns}
            rows={data}
            getRowId={(row) => row._id}
            onFilterModelChange={onFilterChange}
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
            initialState={{
              filter: {
                filterModel: {
                  items: [],
                  quickFilterValues: [quickFilterValue[0]],
                },
              },
            }}
          />
        </Box>
      </Box>
    </MainContainer>
  );
}
