import { MainContainer } from '../../AppBar/Style';
import { useSelector } from 'react-redux';
import {
  getContractsPagintationCursor,
  removeContract,
  getContractsAdvancedFilters,
} from '../../../functions/product';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Button, Box, Typography, Stack } from '@mui/material';
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
  GridActionsCellItem,
  gridClasses,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  gridQuickFilterValuesSelector,
} from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import moment from 'moment';
import { Link } from 'react-router-dom';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { grey } from '@mui/material/colors';
import Filters from './Filters';
import Export from './Export';
import { toast } from 'react-toastify';

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

export default function AdminDashboard() {
  const { drawer, user } = useSelector((state) => ({ ...state }));
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(25);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [quickFilterValue, setQuickFilterValue] = useState([]);

  const [sortOptions, setSortOptions] = useState({});
  const [filterValues, setFilterValues] = useState({
    partenaire: '',
    qualificationQté: '',
    qualificationWc: '',
    dateRange: {
      startDate: moment().toDate(),
      endDate: null,
      key: 'selection',
    },
  });

  const CustomFooter = () => {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
      <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="body2"
          sx={{ pt: 1 }}
        >{`${totalRowCount} résultats`}</Typography>
        <Pagination
          variant="outlined"
          shape="rounded"
          color="primary"
          count={pageCount}
          page={page + 1}
          onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
      </Box>
    );
  };

  const onFilterChange = useCallback((filterModel) => {
    const value = filterModel.quickFilterValues;
    setQuickFilterValue(value);
  }, []);

  const columns = useMemo(() => [
    { headerName: 'clientRef ', field: 'clientRef', flex: 1.4 },
    { headerName: 'partenaire ', field: 'partenaire', flex: 1.3 },
    { headerName: 'Énergie', field: 'Énergie', flex: 1 },

    {
      headerName: 'date début',
      field: 'date_début',
      flex: 1.25,
      renderCell: (params) => moment(params.value).format('DD/MM/YYYY HH:mm'),
    },
    { headerName: 'statut ', field: 'statut', flex: 1 },
    {
      headerName: 'date signature',
      field: 'date_signature',
      flex: 1.25,
      renderCell: (params) => moment(params.value).format('DD/MM/YYYY HH:mm'),
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
          //onClick={() => console.log(params.row.clientRef)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          component={Link}
          to={`/contract-update/${params.row.contratRef}`}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleRemove(params.id)}
          showInMenu
        />,
      ],
    },
  ]);

  const handleRemove = async (id) => {
    if (window.confirm(`delete ${id}`)) {
      setLoading(true);
      toast
        .promise(removeContract(id, user.token), {
          pending: {
            render() {
              return 'Deleting Contract...';
            },
            icon: '🔄',
            // You can also set the autoClose option to false to keep the toast open
            // while the Promise is pending.
          },
          success: {
            render() {
              return 'Contract deleted Successfully!';
            },
            // other options
            icon: '👍',
          },
          error: {
            render({ data }) {
              // When the Promise rejects, data will contain the error
              return `Error: ${data.message}`;
            },
            // other options
            icon: '❌',
          },
        })

        .then((res) => {
          setLoading(false);
          loadData();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const loadAdvancedFiltredData = useCallback(() => {
    setOpen(false);
    setLoading(true);
    getContractsAdvancedFilters(
      filterValues,
      quickFilterValue,
      page,
      pageSize
    ).then((c) => {
      const { data, totalRowCount } = c.data;
      setData(data);
      setTotalRowCount(totalRowCount);
      setLoading(false);
    });
  });

  const loadData = useCallback(() => {
    setLoading(true);
    getContractsPagintationCursor(sortOptions, pageSize, page).then((c) => {
      const { data, totalRowCount } = c.data;
      setTotalRowCount(totalRowCount);
      setData(data);
      setLoading(false);
    });
  }, [page, pageSize]);

  useEffect(() => {
    if (!quickFilterValue || quickFilterValue.length === 0) {
      if (
        !filterValues ||
        (filterValues.partenaire === '' &&
          filterValues.qualificationQté === '' &&
          filterValues.qualificationWc === '' &&
          filterValues.dateRange.endDate === null)
      ) {
        loadData();
      } else {
        localStorage.setItem(
          'quickFilterValue',
          JSON.stringify(quickFilterValue)
        );
        loadAdvancedFiltredData();
      }
    } else {
      localStorage.setItem(
        'quickFilterValue',
        JSON.stringify(quickFilterValue)
      );

      loadAdvancedFiltredData();
    }
  }, [loadData, quickFilterValue, sortOptions]);

  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCountState` from being undefined during the loading
  const [rowCountState, setRowCountState] = useState(totalRowCount || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      totalRowCount !== undefined ? totalRowCount : prevRowCountState
    );
  }, [totalRowCount, setRowCountState]);

  const handleSortModelChange = useCallback((sortModel) => {
    // Here you save the data you need from the sort model
    setSortOptions(sortModel);
  }, []);
  const handlePageChange = (newPage) => {
    // We have the cursor, we can allow the page transition.
    setPage(newPage);
  };

  return (
    <MainContainer open={drawer}>
      <Box sx={{ height: '100%', width: '100%', pl: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
          <Typography variant="h3" component="h3">
            Manage Contracts admin
          </Typography>
          <Stack direction="row" spacing={1} sx={{ height: '40px', mt: 2 }}>
            <Button
              variant="outlined"
              component={Link}
              to="/admin/contract"
              startIcon={<CreateNewFolderIcon />}
            >
              Inserer un fichier
            </Button>
            <Filters
              filterValues={filterValues}
              setFilterValues={setFilterValues}
              loadAdvancedFiltredData={loadAdvancedFiltredData}
              loadData={loadData}
              open={open}
              setOpen={setOpen}
            />

            <Export filterValues={filterValues} />
          </Stack>
        </Box>
        <Box sx={{ height: 'calc(100vh - 150px)', width: '100%' }}>
          <DataGrid
            rows={data}
            columns={columns}
            pagination
            disableColumnFilter
            pageSize={pageSize}
            rowsPerPageOptions={[pageSize]}
            rowCount={rowCountState}
            paginationMode="server"
            onPageChange={handlePageChange}
            page={page}
            getRowId={(row) => row._id}
            loading={loading}
            filterMode="server"
            onFilterModelChange={onFilterChange}
            sortingMode="server"
            onSortModelChange={handleSortModelChange}
            components={{
              Footer: CustomFooter,
              Toolbar: CustomToolbar,
            }}
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
            // initialState={{
            //   filter: {
            //     filterModel: {
            //       items: [],
            //       quickFilterValues: [quickFilterValue],
            //     },
            //   },
            // }}
          />
        </Box>
      </Box>
    </MainContainer>
  );
}
