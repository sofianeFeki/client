import React, { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { DateRangePicker } from 'react-date-range';
import moment from 'moment';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
  OutlinedInput,
  InputAdornment,
  Chip,
  Badge,
} from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const initialPartenaires = [
  'Kompar Energie 00',
  'Kompar Energie 01',
  'kompar energie 29',
  'kompar energie 28',
  'Kompar_TV_KE31',
];

const initialQualificationsQté = [
  'conforme',
  'non_conforme',
  'SAV',
  'annulation',
  'non-qualifié',
];

const initialQualificationsWc = [
  'validé',
  'A_suivre',
  'annulation',
  'non-qualifié',
  'SAV',
  'faux_numéro',
];

const Filters = ({
  filterValues,
  setFilterValues,
  loadAdvancedFiltredData,
  loadData,
  open,
  setOpen,
}) => {
  const [openDate, setOpenDate] = useState(false);
  const [partenaires, setPartenaires] = useState('');
  const [qualificationsQté, setQualificationsQté] = useState('');
  const [qualificationsWc, setQualificationsWc] = useState('');
  const [filterLength, setFilterLength] = useState(0);

  const [state, setState] = useState([
    {
      startDate: moment().toDate(),
      endDate: null,
      key: 'selection',
    },
  ]);

   useEffect(() => {
    // we offset the time zone to not get 
    const timezoneOffset = new Date().getTimezoneOffset();
    const startDate = moment(state[0].startDate)
      .utcOffset(timezoneOffset, true)
      .toISOString();

    const endDate = state[0].endDate
      ? moment(state[0].endDate).utcOffset(timezoneOffset, true).toISOString()
      : null;

    const updatedFilterValues = {
      ...filterValues,
      dateRange: {
        startDate,
        endDate,
        key: 'selection',
      },
    };
    setFilterValues(updatedFilterValues);
  }, [state]);

  // get the target element to toggle
  const refOne = useRef(null);

  // useEffect(() => {
  //   // event listeners
  //   document.addEventListener('keydown', hideOnEscape, true);
  //   document.addEventListener('click', hideOnClickOutside, true);
  // }, []);

  // // hide dropdown on ESC press
  // const hideOnEscape = (e) => {
  //   // console.log(e.key)
  //   if (e.key === 'Escape') {
  //     setOpenDate(false);
  //   }
  // };

  // // Hide dropdown on outside click
  // const hideOnClickOutside = (e) => {
  //   // console.log(refOne.current)
  //   // console.log(e.target)
  //   if (refOne.current && !refOne.current.contains(e.target)) {
  //     setOpenDate(false);
  //   }
  // };

  const handleClickOpen = () => {
    setOpen(true);
    console.log(filterValues);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePartenaireChange = (event) => {
    setPartenaires(event.target.value);
    setFilterValues((prevState) => ({
      ...prevState,
      partenaire: event.target.value,
    }));
  };

  const handleQtéChange = (event) => {
    setQualificationsQté(event.target.value);
    setFilterValues((prevState) => ({
      ...prevState,
      qualificationQté: event.target.value,
    }));
  };

  const handleWcChange = (event) => {
    setQualificationsWc(event.target.value);
    setFilterValues((prevState) => ({
      ...prevState,
      qualificationWc: event.target.value,
    }));
  };

  const handleReset = () => {
    setPartenaires('');
    setQualificationsQté('');
    setQualificationsWc('');
    setState([
      {
        startDate: moment().toDate(),
        endDate: null,
        key: 'selection',
      },
    ]);
    setFilterValues({});

    loadData();
  };

  const filtersSelected =
    !!partenaires.length ||
    !!qualificationsQté.length ||
    !!qualificationsWc.length ||
    !!state[0].endDate;

  const filtersCount =
    (partenaires.length ? 1 : 0) +
    (qualificationsQté.length ? 1 : 0) +
    (qualificationsWc.length ? 1 : 0) +
    (state[0].endDate ? 1 : 0);

  return (
    <div>
      <Badge badgeContent={filtersCount} color="primary">
        <Button
          variant="outlined"
          startIcon={<FilterAltIcon />}
          onClick={handleClickOpen}
        >
          Filters
        </Button>
      </Badge>

      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          {filtersSelected ? (
            <Chip
              onClick={handleReset}
              icon={<FilterAltOffIcon />}
              label="Reset"
            />
          ) : (
            <Chip icon={<FilterAltIcon />} label="Filters" />
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormControl sx={{ mt: 2, minWidth: 120 }} size="small">
              <InputLabel id="select-partenaire">Partenaire</InputLabel>
              <Select
                labelId="select-partenaire"
                id="select-partenaire"
                value={partenaires}
                label="partenaire"
                onChange={handlePartenaireChange}
              >
                {initialPartenaires.map((partenaire) => (
                  <MenuItem key={partenaire} value={partenaire}>
                    {partenaire}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ mt: 2, minWidth: 220 }} size="small">
              <InputLabel id="select-qté">Qualification Qté</InputLabel>
              <Select
                labelId="select-qté"
                id="select-qté"
                value={qualificationsQté}
                label="qualification Qté"
                onChange={handleQtéChange}
              >
                {initialQualificationsQté.map((qualificationQté) => (
                  <MenuItem key={qualificationQté} value={qualificationQté}>
                    {qualificationQté}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ mt: 2, minWidth: 220 }} size="small">
              <InputLabel id="select-wc">Qualification wc</InputLabel>
              <Select
                labelId="select-wc"
                id="select-wc"
                value={qualificationsWc}
                label="qualification wc"
                onChange={handleWcChange}
              >
                {initialQualificationsWc.map((qualificationWc) => (
                  <MenuItem key={qualificationWc} value={qualificationWc}>
                    {qualificationWc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              size="small"
              label="Date range"
              variant="outlined"
              value={`${
                state[0].startDate
                  ? moment(state[0].startDate).format('DD/MM/YYYY')
                  : 'jj-mm-aaaa'
              } to ${
                state[0].endDate
                  ? moment(state[0].endDate).format('DD/MM/YYYY')
                  : 'jj-mm-aaaa'
              }`}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <DateRangeIcon />
                  </InputAdornment>
                ),
              }}
              onClick={() => setOpenDate(!openDate)}
              sx={{ mt: 2, minWidth: 120 }}
            />

            <div ref={refOne}>
              {openDate && (
                <DateRangePicker
                  style={{ width: '308px' }}
                  onChange={(item) => handleDateRangeChange(item)}
                  showSelectionPreview={true}
                  moveRangeOnFirstSelection={false}
                  months={1}
                  ranges={state}
                  direction="horizontal"
                />
              )}
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button disabled={!filtersSelected} onClick={loadAdvancedFiltredData}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Filters;
