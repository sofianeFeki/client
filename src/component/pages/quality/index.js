import { MainContainer } from '../../AppBar/Style';
import { useSelector } from 'react-redux';
import {
  qualityContractsPaginationCursor,
  getContractsFilters,
} from '../../../functions/product';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
  GridActionsCellItem,
  gridClasses,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import VisibilityIcon from '@mui/icons-material/Visibility';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { grey } from '@mui/material/colors';

function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ justifyContent: 'space-between' }}>
      <Box>
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarFilterButton />
      </Box>
      <Box>
        <GridToolbarQuickFilter />
      </Box>
    </GridToolbarContainer>
  );
}

// const initialState = JSON.parse(localStorage.getItem('quickFilterValue')) || [];

export default function Quality() {
  const { drawer, user } = useSelector((state) => ({ ...state }));

  const mapPageToNextCursor = useRef({});
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(25);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [cursor, setCursor] = useState(null);
  const [filterOptions, setFilterOptions] = useState([]);
  const [quickFilterValue, setQuickFilterValue] = useState([]);
  const [sortOptions, setSortOptions] = useState({});

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

  const queryOptions = useMemo(
    () => ({
      page: page,
      pageSize: pageSize,
      //  sortOptions: sortOptions,
    }),
    [page, pageSize]
  );

  const onFilterChange = useCallback((filterModel) => {
    const filterValues = filterModel.items
      .filter((filter) => filter.value)
      .map((items) => ({
        column: items.columnField,
        operator: items.operatorValue,
        value: items.value,
      }));
    console.log(filterModel);
    setFilterOptions(filterValues);
    setQuickFilterValue(filterModel.quickFilterValues || []);
  }, []);

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
          //onClick={() => console.log(params.row.clientRef)}
        />,
      ],
    },
  ]);

  // useEffect(() => {
  //   localStorage.setItem('quickFilterValue', JSON.stringify(quickFilterValue));
  // }, [quickFilterValue]);

  const loadFiltredData = useCallback(() => {
    setLoading(true);

    getContractsFilters(
      filterOptions,
      quickFilterValue,
      sortOptions,
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
    qualityContractsPaginationCursor(page, pageSize).then((c) => {
      const { data, totalRowCount } = c.data;
      setTotalRowCount(totalRowCount);
      setData(data);
      setLoading(false);
    });
  }, [queryOptions]);

  useEffect(() => {
    if (!quickFilterValue || quickFilterValue.length === 0) {
      if (
        !filterOptions ||
        !filterOptions.length ||
        filterOptions[0].value === ''
      ) {
        loadData();
      } else {
        loadFiltredData();
      }
    } else {
      loadFiltredData();
    }
  }, [loadData, filterOptions, quickFilterValue, sortOptions]);

  useEffect(() => {
    if (!loading && cursor) {
      // We add nextCursor when available
      mapPageToNextCursor.current[page + 1] = cursor;
    }
  }, [page, loading, cursor]);

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
    setCursor(mapPageToNextCursor.current[newPage]);
  };

  return (
    <MainContainer open={drawer}>
      <Box sx={{ height: '100%', width: '100%', pl: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'start', py: 2 }}>
          <Typography variant="h3" component="h3">
            Manage Contracts quality
          </Typography>
        </Box>
        <Box sx={{ height: 'calc(100vh - 150px)' }}>
          <DataGrid
            rows={data}
            columns={columns}
            pagination
            pageSize={pageSize}
            rowsPerPageOptions={[pageSize]}
            rowCount={rowCountState}
            paginationMode="server"
            onPageChange={handlePageChange}
            disableMultipleColumnsFiltering={false}
            page={page}
            getRowId={(row) => row._id}
            loading={loading}
            filterMode="server"
            onFilterModelChange={onFilterChange}
            // filterModel={filterModel}
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
