import { MainContainer } from '../../AppBar/Style';
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import {
  getContractsPagintationCursor,
  getContractsFilters,
  removeContract,
} from '../../../functions/product';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import {
  GridToolbarQuickFilter,
  GridToolbarContainer,
  GridToolbar,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
  GridActionsCellItem,
  gridClasses,
} from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SyncIcon from '@mui/icons-material/Sync';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { grey } from '@mui/material/colors';

const SUBMIT_FILTER_STROKE_TIME = 500;

function InputNumberInterval(props) {
  const { item, applyValue, focusElementRef = null } = props;

  const filterTimeout = useRef();
  const [filterValueState, setFilterValueState] = useState([
    item.value ? new Date(item.value[0]) : undefined,
    item.value ? new Date(item.value[1]) : undefined,
  ]);
  const [applying, setIsApplying] = useState(false);

  useEffect(() => {
    return () => {
      clearTimeout(filterTimeout.current);
    };
  }, []);

  useEffect(() => {
    const itemValue = item.value ?? [undefined, undefined];
    setFilterValueState(itemValue);
  }, [item.value]);

  const updateFilterValue = (startDate, endDate) => {
    clearTimeout(filterTimeout.current);
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    // const isoStartDate = startDateObj.toISOString();
    // const isoEndDate = endDateObj.toISOString();

    setFilterValueState([startDateObj, endDateObj]);
    setIsApplying(true);

    filterTimeout.current = setTimeout(() => {
      setIsApplying(false);
      applyValue({ ...item, value: [startDateObj, endDateObj] });
    }, SUBMIT_FILTER_STROKE_TIME);
  };

  const handleUpperFilterChange = (event) => {
    const newUpperBound = event.target.value;
    console.log(newUpperBound);
    updateFilterValue(filterValueState[0], newUpperBound);
  };
  const handleLowerFilterChange = (event) => {
    const newLowerBound = event.target.value;
    console.log(newLowerBound);

    updateFilterValue(newLowerBound, filterValueState[1]);
  };

  return (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'end',
        height: 48,
        pl: '20px',
        width: 300,
      }}
    >
      <TextField
        name="lower-bound-input"
        placeholder="From"
        label="From"
        variant="standard"
        // value={Date(filterValueState[0])}
        onChange={handleLowerFilterChange}
        type="date"
        inputRef={focusElementRef}
        sx={{ mr: 2 }}
      />
      <TextField
        name="upper-bound-input"
        placeholder="To"
        label="To"
        variant="standard"
        //value={Date(filterValueState[1])}
        onChange={handleUpperFilterChange}
        type="date"
        InputProps={applying ? { endAdornment: <SyncIcon /> } : {}}
      />
    </Box>
  );
}

// InputNumberInterval.propTypes = {
//   applyValue: PropTypes.func.isRequired,
//   focusElementRef: PropTypes.oneOfType([
//     PropTypes.func,
//     PropTypes.shape({
//       current: PropTypes.any.isRequired,
//     }),
//   ]),
//   item: PropTypes.shape({
//     /**
//      * The column from which we want to filter the rows.
//      */
//     columnField: PropTypes.date.isRequired,
//     /**
//      * Must be unique.
//      * Only useful when the model contains several items.
//      */
//     id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
//     /**
//      * The name of the operator we want to apply.
//      * Will become required on `@mui/x-data-grid@6.X`.
//      */
//     operatorValue: PropTypes.string,
//     /**
//      * The filtering value.
//      * The operator filtering function will decide for each row if the row values is correct compared to this value.
//      */
//     value: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
//   }).isRequired,
// };

const quantityOnlyOperators = [
  {
    label: 'Between',
    value: 'between',
    getApplyFilterFn: (filterItem) => {
      if (!Array.isArray(filterItem.value) || filterItem.value.length !== 2) {
        return null;
      }
      if (filterItem.value[0] == null || filterItem.value[1] == null) {
        return null;
      }

      return ({ value }) => {
        return (
          value !== null &&
          filterItem.value[0] <= value &&
          value <= filterItem.value[1]
        );
      };
    },
    InputComponent: InputNumberInterval,
  },
];

export default function AdminDashboard() {
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
  // const [filterModel, setFilterModel] = useState({
  //   items: [
  //     // {
  //     //   id: 1,
  //     //   columnField: 'email',
  //     //   //value: [5000, 15000],
  //     //   operatorValue: 'between',
  //     // },
  //   ],
  // });

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
      cursor: mapPageToNextCursor.current[page],
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
    { title: 'contratRef', field: 'contratRef', width: 150 },
    { title: 'clientRef ', field: 'clientRef', width: 150 },
    { title: 'civility', field: 'civility', width: 80 },
    { title: 'prenom ', field: 'prenom', width: 100 },
    { title: 'tel ', field: 'tel', width: 100 },
    { title: 'partenaire ', field: 'partenaire', width: 160 },

    {
      title: 'dateActivationElec ',
      field: 'dateActivationElec',
      width: 160,
    },
    { title: 'comune ', field: 'comune', width: 100 },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="open"
          component={Link}
          to={`/contract/${params.row.clientRef}`}
          //onClick={() => console.log(params.row.clientRef)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          component={Link}
          to={`/contract-update/${params.row.clientRef}`}
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

  const colun = useMemo(() => {
    const newColumns = [...columns];

    if (newColumns.length > 0) {
      const index = newColumns.findIndex(
        (col) => col.field === 'dateActivationElec'
      );
      const quantityColumn = newColumns[index];

      newColumns[index] = {
        ...quantityColumn,
        filterOperators: quantityOnlyOperators,
      };
    }

    return newColumns;
  }, [columns]);

  const handleRemove = async (id) => {
    if (window.confirm(`delete ${id}`)) {
      setLoading(true);
      removeContract(id, user.token)
        .then((res) => {
          setLoading(false);
          loadData();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const loadFiltredData = useCallback(() => {
    setLoading(true);

    getContractsFilters(filterOptions, quickFilterValue, sortOptions).then(
      (c) => {
        const { data, totalRowCount } = c.data;
        // if (page > 1) {
        //   setPage(0);
        // }

        const skip = page * pageSize;
        setData(data.slice(skip, skip + pageSize));
        setTotalRowCount(totalRowCount);
        setLoading(false);
      }
    );
  });

  const loadData = useCallback(() => {
    setLoading(true);
    getContractsPagintationCursor(cursor, pageSize, page).then((c) => {
      const { data, totalRowCount, nextCursor } = c.data;
      setCursor(nextCursor);
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
          <Typography variant="h3" component="h3">
            Manage Contracts admin
          </Typography>
          <Box sx={{ height: '40px', mt: 2 }}>
            <Button
              variant="outlined"
              component={Link}
              to="/admin/contract"
              startIcon={<CreateNewFolderIcon />}
            >
              Inserer un fichier
            </Button>
          </Box>
        </Box>
        <Box sx={{ height: 'calc(100vh - 150px)', width: '100%' }}>
          <DataGrid
            rows={data}
            columns={colun}
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
              Toolbar: GridToolbar,
            }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
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
          />
        </Box>
      </Box>
    </MainContainer>
  );
}
