import {
  Button,
  FormGroup,
  Grid,
  MenuItem,
  Select,
  TextField,
  Box,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getContract, updateContractData } from '../../../functions/product';
import { MainContainer } from '../../AppBar/Style';
import { toast } from 'react-toastify';

const intialState = {
  contratRef: '',
  clientRef: '',
  Civility: '',
  Prénom: '',
  Nom: '',
  tel: '',
  email: '',
  Adresse: '',
  CodePostal: '',
  Commune: '',
  Énergie: '',
  PDL: '',
  Puissance: '',
  offre: '',
  statut: '',
  partenaire: '',
  mensualité: '',
};

const ContractUpdate = () => {
  let { slug } = useParams();
  const history = useNavigate();
  const { drawer, user } = useSelector((state) => ({ ...state }));

  const [values, setValues] = useState(intialState);
  const [loading, setLoading] = useState(false);
  const {
    contratRef,
    clientRef,
    Civility,
    Prénom,
    Nom,
    tel,
    email,
    Adresse,
    CodePostal,
    Commune,
    Énergie,
    PDL,
    Puissance,
    offre,
    statut,
    partenaire,
    mensualité,
  } = values;

  useEffect(() => {
    loadContract();
  }, []);

  const loadContract = () => {
    getContract(slug).then((p) => {
      setValues({ ...values, ...p.data });
      console.log(p.data);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    toast
      .promise(updateContractData(slug, values, user.token), {
        pending: {
          render() {
            return 'Updating Contract...';
          },
          icon: '🔄',
          // You can also set the autoClose option to false to keep the toast open
          // while the Promise is pending.
        },
        success: {
          render() {
            return 'Contract Updated Successfully!';
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
        history('/admin');
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  };

  return (
    <MainContainer open={drawer}>
      <form onSubmit={handleSubmit}>
        <FormGroup sx={{ p: 2 }}>
          <TextField
            label="contratRef"
            type={'text'}
            name="contratRef"
            variant="outlined"
            sx={{ mb: 2, width: '40%' }}
            size="small"
            value={contratRef}
            onChange={handleChange}
          />
          <TextField
            label="clientRef"
            type={'text'}
            name="clientRef"
            variant="outlined"
            sx={{ mb: 2, width: '40%' }}
            size="small"
            value={clientRef}
            onChange={handleChange}
          />{' '}
          <TextField
            label="Énergie"
            type={'text'}
            name="Énergie"
            variant="outlined"
            sx={{ mb: 2, width: '40%' }}
            size="small"
            value={Énergie}
            onChange={handleChange}
          />{' '}
          <TextField
            label="Puissance"
            type={'text'}
            name="Puissance"
            variant="outlined"
            sx={{ mb: 2, width: '40%' }}
            size="small"
            value={Puissance}
            onChange={handleChange}
          />{' '}
          <TextField
            label="offre"
            type={'text'}
            name="offre"
            variant="outlined"
            sx={{ mb: 2, width: '40%' }}
            size="small"
            value={offre}
            onChange={handleChange}
          />{' '}
          <TextField
            label="statut"
            type={'text'}
            name="statut"
            variant="outlined"
            sx={{ mb: 2, width: '40%' }}
            size="small"
            value={statut}
            onChange={handleChange}
          />{' '}
          <TextField
            label="partenaire"
            type={'text'}
            name="partenaire"
            variant="outlined"
            sx={{ mb: 2, width: '40%' }}
            size="small"
            value={partenaire}
            onChange={handleChange}
          />{' '}
          <TextField
            label="point de livraison"
            type={'text'}
            name="PDL"
            variant="outlined"
            sx={{ mb: 2, width: '40%' }}
            size="small"
            value={PDL}
            onChange={handleChange}
          />{' '}
          <TextField
            label="mensualité"
            type={'text'}
            name="mensualité"
            variant="outlined"
            sx={{ mb: 2, width: '40%' }}
            size="small"
            value={mensualité}
            onChange={handleChange}
          />{' '}
          <TextField
            label="Civility"
            type={'text'}
            name="Civility"
            variant="outlined"
            sx={{ mb: 2, width: '40%' }}
            size="small"
            value={Civility}
            onChange={handleChange}
          />{' '}
          <TextField
            label="Prénom"
            type={'text'}
            name="Prénom"
            variant="outlined"
            sx={{ mb: 2, width: '40%' }}
            size="small"
            value={Prénom}
            onChange={handleChange}
          />{' '}
          <TextField
            label="Nom"
            type={'text'}
            name="Nom"
            variant="outlined"
            sx={{ mb: 2, width: '40%' }}
            size="small"
            value={Nom}
            onChange={handleChange}
          />{' '}
          <TextField
            label="tel"
            type={'text'}
            name="tel"
            variant="outlined"
            sx={{ mb: 2, width: '40%' }}
            size="small"
            value={tel}
            onChange={handleChange}
          />{' '}
          <TextField
            label="email"
            type={'text'}
            name="email"
            variant="outlined"
            sx={{ mb: 2, width: '40%' }}
            size="small"
            value={email}
            onChange={handleChange}
          />
          <TextField
            label="Adresse"
            type={'text'}
            name="Adresse"
            variant="outlined"
            sx={{ mb: 2, width: '40%' }}
            size="small"
            value={Adresse}
            onChange={handleChange}
          />
          <TextField
            label="CodePostal"
            type={'text'}
            name="CodePostal"
            variant="outlined"
            sx={{ mb: 2, width: '40%' }}
            size="small"
            value={CodePostal}
            onChange={handleChange}
          />
          <TextField
            label="Commune"
            type={'text'}
            name="Commune"
            variant="outlined"
            sx={{ mb: 2, width: '40%' }}
            size="small"
            value={Commune}
            onChange={handleChange}
          />
        </FormGroup>
        <Box sx={{ px: 2 }}>
          <Button type="submit" variant="contained">
            save
          </Button>
        </Box>
      </form>
    </MainContainer>
  );
};

export default ContractUpdate;
