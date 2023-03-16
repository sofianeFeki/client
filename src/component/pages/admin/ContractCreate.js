import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx/xlsx.mjs';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { createContract } from '../../../functions/product';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { MainContainer } from '../../AppBar/Style';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CancelIcon from '@mui/icons-material/Cancel';
import moment from 'moment/moment';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { grey } from '@mui/material/colors';

const EXTENSIONS = ['xlsx', 'xls', 'csv'];

const ContractCreate = () => {
  const history = useNavigate();
  const [colDefs, setColDefs] = useState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const { user, drawer } = useSelector((state) => ({ ...state }));
  const columns = useMemo(() => [
    { title: 'contratRef', field: 'contratRef', width: 200 },
    { title: 'clientRef ', field: 'clientRef', width: 200 },
    { title: 'civility', field: 'Civility', width: 80, editable: true },
    { title: 'prenom ', field: 'Prénom', width: 100, editable: true },
    { title: 'nom ', field: 'Nom', width: 100, editable: true },
    { title: 'tel ', field: 'tel', width: 100, editable: true },
    { title: 'email ', field: 'email', editable: true },
    { title: 'Adresse ', field: 'Adresse', editable: true },
    { title: 'codePostal ', field: 'CodePostal', editable: true },
    { title: 'comune ', field: 'Commune', editable: true },
    { title: 'energie ', field: 'Énergie', width: 100 },
    { title: 'Point de livraison', field: 'PDL', width: 100, editable: true },
    {
      title: 'Puissance du point/Classe',
      field: 'Puissance',
      width: 100,
      editable: true,
    },
    { title: 'offre', field: 'offre', width: 100, editable: true },
    { title: 'statut', field: 'statut', width: 100, editable: true },
    {
      title: 'Nom du partenaire',
      field: 'partenaire',
      width: 100,
      editable: true,
    },
    {
      title: 'date de début',
      field: 'date_début',
      editable: true,
      type: 'date',

      renderCell: (params) =>
        moment(params.row.date_début, 'DD/MM/YYYY HH:mm').format(
          'DD/MM/YYYY HH:mm'
        ),
    },
    {
      title: 'date de la signature',
      field: 'date_signature',
      editable: true,
      type: 'date',

      renderCell: (params) =>
        moment(params.row.date_signature, 'DD/MM/YYYY HH:mm').format(
          'DD/MM/YYYY HH:mm'
        ),
    },
    {
      mensualité: 'mensualité',
      field: 'mensualité',
      width: 100,
      editable: true,
    },
  ]);
  const getExention = (file) => {
    const parts = file.name.split('.');
    const extension = parts[parts.length - 1];
    return EXTENSIONS.includes(extension); // return boolean
  };

  const convertToJson = (headers, data) => {
    const rows = [];
    data.forEach((row) => {
      let rowData = {};
      row.forEach((element, index) => {
        if (
          headers[index].includes('date_début') ||
          headers[index].includes('date_signature')
        ) {
          // check if the header contains "date"
          rowData[headers[index]] = moment(
            element,
            'DD/MM/YYYY HH:mm'
          ).toDate();
        } else {
          rowData[headers[index]] = element;
        }
      });
      rows.push(rowData);
    });
    return rows;
  };

  const importExcel = (e) => {
    setUploadLoading(true);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      //parse data

      const bstr = event.target.result;
      const workBook = XLSX.read(bstr, { type: 'binary' });

      //get first sheet
      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];
      //convert to array
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
      //console.log(fileData)
      const headers = fileData[0];

      const hasClientRef = headers.includes('contratRef');
      if (hasClientRef) {
        setColDefs(columns);

        //removing header
        fileData.splice(0, 1);

        setData(convertToJson(headers, fileData));

        setUploadLoading(false);
      } else {
        setData([]);
        setUploadLoading(false);
        toast.error(
          'The uploaded Excel file does not contain the required contratRef field. Please select a different file that contains the required field and try again.'
        );
      }
    };

    if (file) {
      if (getExention(file)) {
        reader.readAsBinaryString(file);
      } else {
        alert('Invalid file input, Select Excel, CSV file');
        setUploadLoading(false);
      }
    } else {
      setData([]);
      setColDefs([]);
    }
  };

  const handleSubmit = (e) => {
    // console.log(data);
    setLoading(true);
    e.preventDefault();
    createContract(data, user.token)
      .then((res) => {
        //console.log(res);
        setLoading(false);
        window.alert('Add New Data To db');
        setLoading(false);
        //window.location.reload();
        history('/back-office');
      })
      .catch((err) => {
        console.log(err);
        // if (err.response.status === 400) toast.error(err.response.data);
      });
  };

  const handleReset = () => {
    setData([]);
  };

  return (
    <MainContainer open={drawer}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Typography variant="h3" component="h3">
            Manage Contracts
          </Typography>
          <Stack direction="row" spacing={2} sx={{ height: '40px', mt: 2 }}>
            {data && data.length ? (
              <Button
                variant="outlined"
                component="label"
                startIcon={<CancelIcon />}
                onClick={handleReset}
              >
                Reset
              </Button>
            ) : (
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                disabled={uploadLoading}
              >
                importer
                <input hidden type="file" onChange={importExcel} />
              </Button>
            )}

            {/* <LoadingButton
              loading={loading}
              loadingPosition="start"
              variant="outlined"
              startIcon={<UploadFileIcon />}
            >
              importer
              <input hidden type="file" onChange={importExcel} />
            </LoadingButton> */}
            <LoadingButton
              variant="contained"
              type="submit"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              loading={loading}
              loadingPosition="start"
              disabled={!data.length}
            >
              Enregistrer
            </LoadingButton>
          </Stack>
        </Box>

        <Box sx={{ height: 'calc(100vh - 150px)', width: '100%', p: 2 }}>
          <DataGrid
            title="Olympic Data"
            columns={columns}
            rows={data}
            getRowId={(row) => row.contratRef}
            loading={uploadLoading}
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
      </form>
    </MainContainer>
  );
};

export default ContractCreate;
