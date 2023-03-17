import {
  Stack,
  Typography,
  Button,
  Slide,
  CircularProgress,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getContractsCount } from '../../../functions/product';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  gridClasses,
  GridToolbarExport,
  GridToolbarQuickFilter,
  GridToolbar,
} from '@mui/x-data-grid';
import { MainContainer } from '../../AppBar/Style';
import { useSelector } from 'react-redux';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DownloadIcon from '@mui/icons-material/Download';
import { Link } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import AdminDashboard from '../admin';

// function CustomToolbar() {
//   return (
//     <GridToolbarContainer>
//       <GridToolbarColumnsButton />
//       <GridToolbarFilterButton />
//       <GridToolbarDensitySelector />
//       <GridToolbarExport />
//       <GridToolbarQuickFilter />
//     </GridToolbarContainer>
//   );
// }

const BackOffice = () => {
  // const [page, setPage] = useState(0);
  // const [contracts, setContracts] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [contractsCount, setContractCount] = useState(0);
  // const [pageSize, setPageSize] = useState(25);
  // const [filter, setFilter] = useState([]);
  // const [quickFilter, setQuickFilter] = useState([]);
  // const { drawer } = useSelector((state) => ({ ...state }));
  // const columns = useMemo(() => [
  //   { title: 'contratRef', field: 'contratRef', width: 200 },
  //   { title: 'clientRef ', field: 'clientRef', width: 200 },
  //   { title: 'civility', field: 'civility', width: 80 },
  //   { title: 'prenom ', field: 'prenom', width: 100 },
  //   { title: 'tel ', field: 'tel', width: 100 },
  //   { title: 'email ', field: 'email' },
  //   { title: 'adresse ', field: 'adresse' },
  //   { title: 'codePostal ', field: 'codePostal' },
  //   { title: 'comune ', field: 'comune' },
  //   { title: 'mensualiteElec ', field: 'mensualiteElec' },
  //   { title: 'optionTarifaire ', field: 'optionTarifaire' },
  // ]);

  // useEffect(() => {
  //   loadContracts();
  // }, [page, filter, quickFilter]);

  // useEffect(() => {
  //   getContractsCount().then((res) => setContractCount(res.data));
  // }, []);

  // const loadContracts = () => {
  //   setLoading(true);
  //   getContractsAll('createdAt', 'desc', page, filter, quickFilter).then((c) =>
  //     setContracts(c.data)
  //   );
  //   // console.log(page);
  //   setLoading(false);
  // };

  // const onFilterChange = useCallback((filterModel) => {
  //   console.log(filterModel);
  //   if (filterModel && filterModel.items) {
  //     const filterValues = filterModel.items
  //       .filter((filter) => filter.value && filter.value.trim() !== '')
  //       .map((items) => {
  //         return {
  //           column: items.columnField,
  //           operator: items.operatorValue,
  //           value: items.value,
  //         };
  //       });

  //     setFilter(filterValues);
  //   }
  //   if (filterModel && filterModel.quickFilterValues) {
  //     const quickFilterValue = filterModel.quickFilterValues;
  //     setQuickFilter(quickFilterValue);
  //   }
  // }, []);

  // // Some API clients return undefined while loading
  // // Following lines are here to prevent `rowCountState` from being undefined during the loading
  // const [rowCountState, setRowCountState] = useState(contractsCount || 0);

  // useEffect(() => {
  //   setRowCountState((prevRowCountState) =>
  //     contractsCount !== undefined ? contractsCount : prevRowCountState
  //   );
  // }, [contractsCount, setRowCountState]);

  return (
    <>
      <Box>
        {/* <DataGrid
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: {
                debounceMs: 500,
              },
            },
          }}
          columns={columns}
          rows={contracts}
          pagination
          rowCount={rowCountState}
          loading={loading}
          rowsPerPageOptions={[25, 50, 100]}
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          getRowId={(row) => row._id}
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
          filterMode="server"
          onFilterModelChange={onFilterChange}
        /> */}
        <AdminDashboard />
      </Box>
    </>
  );
};

export default BackOffice;
