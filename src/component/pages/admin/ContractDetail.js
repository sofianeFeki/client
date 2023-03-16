import { Button, Divider, Typography, Stack } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getContract } from '../../../functions/product';
import { MainContainer } from '../../AppBar/Style';
import { DrawerHeader } from '../../AppBar/Style';
import Calification from '../quality/Calification';
import CalificationSav from '../Sav.js/CalificationSav';
import CalificationWc from '../wc/CalificationWc';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import moment from 'moment';

function createData(name, value) {
  return { name, value };
}

const ContractDetail = () => {
  const { drawer } = useSelector((state) => ({ ...state }));

  const [data, setData] = useState([]);
  const rowsContract = [
    createData('Ref contrat', data.contratRef),
    createData('Ref client', data.clientRef),
    createData('Énergie', data.Énergie),
    createData('point de livraison', data.PDL),
    createData('partenaire', data.partenaire),
    createData(
      'date début',
      moment(data.date_début).format('DD/MM/YYYY HH:mm')
    ),
    createData(
      'data de signature',
      moment(data.date_signature).format('DD/MM/YYYY HH:mm')
    ),
    createData('mensualité', data.mensualité),
    createData('statut', data.statut),
    createData('Puissance', data.Puissance),
    createData('offre', data.offre),
  ];

  const rowsClient = [
    createData('Civility', data.Civility),
    createData('Prénom', data.Prénom),
    createData('Nom', data.Nom),
    createData('tel', data.tel),
    createData('email', data.email),
    createData('Adresse', data.Adresse),
    createData('CodePostal', data.CodePostal),
    createData('Commune', data.Commune),
  ];

  let { slug } = useParams();
  useEffect(() => {
    loadContract();
  }, []);
  const loadContract = () => {
    getContract(slug).then((c) => setData(c.data));
  };

  return (
    <div>
      <MainContainer open={drawer}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Typography variant="h3" component="h3">
            Détail de la souscription
          </Typography>
          <Stack direction="row" spacing={1} sx={{ height: '40px', mt: 2 }}>
            <Calification />
            <CalificationWc />
            <CalificationSav />
          </Stack>
        </Box>

        <Grid container spacing={2} p={2}>
          <Grid item xs={6}>
            <TableContainer component={Paper} elevation={4}>
              <Table>
                <TableBody>
                  {rowsContract.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={6}>
            <TableContainer component={Paper} elevation={4}>
              <Table>
                <TableBody>
                  {rowsClient.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </MainContainer>
    </div>
  );
};

export default ContractDetail;
