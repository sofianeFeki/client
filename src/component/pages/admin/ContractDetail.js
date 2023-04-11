import { Button, Divider, Typography, Stack } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
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
import { ArrowBack } from '@mui/icons-material';

function createData(name, value) {
  return { name, value };
}

const ContractDetail = () => {
  const { drawer, user } = useSelector((state) => ({ ...state }));
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const { quality } = data;
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

  const handleBackClick = () => {
    if (user.role === 'admin') {
      navigate('/admin');
    }
    if (user.role === 'sav') {
      navigate('/sav');
    }
    if (user.role === 'quality') {
      navigate('/quality');
    }
    if (user.role === 'wc') {
      navigate('/welcome-call');
    }
  };

  let { slug } = useParams();
  useEffect(() => {
    loadContract();
  }, []);
  const loadContract = () => {
    getContract(slug).then((c) => setData(c.data));
    console.log('detail contrat', data);
  };

  return (
    <div>
      <MainContainer open={drawer}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Typography variant="h3" component="h3">
            Détail de la souscription
          </Typography>
          <Stack direction="row" spacing={1} sx={{ height: '40px', mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ArrowBack />}
              onClick={handleBackClick}
            >
              Retour à la liste
            </Button>
            {user && user.role === 'quality' && <Calification />}
            {user && user.role === 'sav' && <CalificationSav />}
            {user && user.role === 'wc' && <CalificationWc />}
            {user && user.role === 'admin' && (
              <>
                <Calification />
                <CalificationWc />
                <CalificationSav />{' '}
              </>
            )}
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
            {quality && (
              <Paper elevation={4} sx={{ height: 150, mt: 1 }}>
                <Box sx={{ p: 2 }}>
                  <Typography sx={{ fontWeight: 700 }}>
                    Qualification qualité : {quality.qualification || ''}
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }}>
                    Commentaire qualité : {quality.comment || ''}
                  </Typography>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </MainContainer>
    </div>
  );
};

export default ContractDetail;
