import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { styled } from '@mui/material/styles';

import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Divider,
  Typography,
  Box,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Switch,
} from '@mui/material';
import { getContract, updateContract } from '../../../functions/product';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

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
const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const Calification = () => {
  let { slug } = useParams();
  const history = useNavigate();
  const { user } = useSelector((state) => ({ ...state }));
  const [open, setOpen] = useState(false);
  const [switchState, setSwitchState] = useState({});
  const [qualification, setQualification] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    loadContract();
  }, []);

  const loadContract = () => {
    getContract(slug).then((p) => {
      console.log(p.data.quality.values);
      const quality = p.data.quality || {}; // default to empty object if quality is not provided
      const defaultQuality = {
        Appel_enregistré: false,
        _14j_de_rétractation: false,
        Autorisation_accès_GRD: false,
        Inscription_Bloctel: false,
        Valider_les_coordonnées_du_client: false,
        Expliquer_que_nous_sommes_KOMPAR: false,
        Explication_changement_de_fournisseur: false,
        Discours_frauduleux_mensenger: false,
        MES_non_conforme: false,
        non_conformité_signature_recap: false,
        Validation_à_la_place_du_prospect: false,
        Comportement_général: false,
        Mineur_trop_âgée_non_lucide: false,
        IBAN_invalide: false,
      };
      setSwitchState({
        ...defaultQuality,
        ...quality.values,
      });
      setQualification(p.data.quality.qualification || '');
      setComment(p.data.quality.comment || '');
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const values = {
      quality: {
        Appel_enregistré: switchState.Appel_enregistré,
        _14j_de_rétractation: switchState._14j_de_rétractation,
        Autorisation_accès_GRD: switchState.Autorisation_accès_GRD,
        Inscription_Bloctel: switchState.Inscription_Bloctel,
        Valider_les_coordonnées_du_client:
          switchState.Valider_les_coordonnées_du_client,
        Expliquer_que_nous_sommes_KOMPAR:
          switchState.Expliquer_que_nous_sommes_KOMPAR,
        Explication_changement_de_fournisseur:
          switchState.Explication_changement_de_fournisseur,
        Discours_frauduleux_mensenger:
          switchState.Discours_frauduleux_mensenger,
        MES_non_conforme: switchState.MES_non_conforme,
        non_conformité_signature_recap:
          switchState.non_conformité_signature_recap,
        Validation_à_la_place_du_prospect:
          switchState.Validation_à_la_place_du_prospect,
        Comportement_général: switchState.Comportement_général,
        Mineur_trop_âgée_non_lucide: switchState.Mineur_trop_âgée_non_lucide,
        IBAN_invalide: switchState.IBAN_invalide,
      },
      qualification: qualification,
      comment: comment,
    };

    // console.log(values);
    toast
      .promise(updateContract(slug, values, user.token), {
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
        if (user.role === 'admin') {
          history('/admin');
        } else {
          history('/quality');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (event) => {
    setSwitchState({
      ...switchState,
      [event.target.name]: event.target.checked,
    });
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleQualificationChange = (event) => {
    setQualification(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Qualité
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          quality qualification
        </DialogTitle>
        <DialogContent>
          <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
            <Typography variant="h6" gutterBottom>
              A Respecter impérativement :
            </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <Android12Switch
                    checked={switchState.Appel_enregistré}
                    name="Appel_enregistré"
                  />
                }
                label="Appel enregistré"
                onChange={handleChange}
              />

              <FormControlLabel
                control={
                  <Android12Switch
                    checked={switchState._14j_de_rétractation}
                    name="_14j_de_rétractation"
                    onChange={handleChange}
                  />
                }
                label="14j de rétractation "
              />
              <FormControlLabel
                control={
                  <Android12Switch
                    checked={switchState.Autorisation_accès_GRD}
                    name="Autorisation_accès_GRD"
                    onChange={handleChange}
                  />
                }
                label="Autorisation accès GRD"
              />

              <FormControlLabel
                control={
                  <Android12Switch
                    checked={switchState.Inscription_Bloctel}
                    name="Inscription_Bloctel"
                    onChange={handleChange}
                  />
                }
                label="Inscription Bloctel"
              />
              <FormControlLabel
                control={
                  <Android12Switch
                    checked={switchState.Valider_les_coordonnées_du_client}
                    name="Valider_les_coordonnées_du_client"
                    onChange={handleChange}
                  />
                }
                label="Valider les coordonnées du client"
              />
              <FormControlLabel
                control={
                  <Android12Switch
                    checked={switchState.Expliquer_que_nous_sommes_KOMPAR}
                    name="Expliquer_que_nous_sommes_KOMPAR"
                    onChange={handleChange}
                  />
                }
                label="Expliquer que nous sommes KOMPAR	"
              />
              <FormControlLabel
                control={
                  <Android12Switch
                    checked={switchState.Explication_changement_de_fournisseur}
                    name="Explication_changement_de_fournisseur"
                    onChange={handleChange}
                  />
                }
                label="Explication changement de fournisseur"
              />

              <Typography variant="h6" gutterBottom>
                Il est strictement interdit de :
              </Typography>

              <FormControlLabel
                control={
                  <Android12Switch
                    color="error"
                    checked={switchState.Discours_frauduleux_mensenger}
                    name="Discours_frauduleux_mensenger"
                    onChange={handleChange}
                  />
                }
                label="Discours frauduleux/mensenger"
              />

              <FormControlLabel
                control={
                  <Android12Switch
                    color="error"
                    checked={switchState.MES_non_conforme}
                    name="MES_non_conforme"
                    onChange={handleChange}
                  />
                }
                label="MES non conforme"
              />
              <FormControlLabel
                control={
                  <Android12Switch
                    color="error"
                    checked={switchState.non_conformité_signature_recap}
                    name="non_conformité_signature_recap"
                    onChange={handleChange}
                  />
                }
                label="non conformité signature / recap"
              />

              <FormControlLabel
                control={
                  <Android12Switch
                    color="error"
                    checked={switchState.Validation_à_la_place_du_prospect}
                    name="Validation_à_la_place_du_prospect"
                    onChange={handleChange}
                  />
                }
                label="Validation à la place du prospect"
              />
              <FormControlLabel
                control={
                  <Android12Switch
                    color="error"
                    checked={switchState.Comportement_général}
                    name="Comportement_général"
                    onChange={handleChange}
                  />
                }
                label="Comportement général"
              />
              <FormControlLabel
                control={
                  <Android12Switch
                    color="error"
                    checked={switchState.Mineur_trop_âgée_non_lucide}
                    name="Mineur_trop_âgée_non_lucide"
                    onChange={handleChange}
                  />
                }
                label="Mineur, trop âgée/non lucide	"
              />
              <FormControlLabel
                control={
                  <Android12Switch
                    color="error"
                    checked={switchState.IBAN_invalide}
                    name="IBAN_invalide"
                    onChange={handleChange}
                  />
                }
                label="IBAN invalide:	"
              />

              <Box sx={{ my: 2 }}>
                <TextField
                  fullWidth
                  label="Commentaire"
                  id="Commentaire"
                  multiline
                  value={comment}
                  onChange={handleCommentChange}
                />
                <FormControl fullWidth size="small" sx={{ my: 2 }}>
                  <InputLabel id="Qualification">Qualification </InputLabel>
                  <Select
                    id="Qualification"
                    label="Qualification"
                    value={qualification}
                    onChange={handleQualificationChange}
                  >
                    <MenuItem value={'non-qualifié'}>non-qualifié</MenuItem>

                    <MenuItem value={'Conforme'}>Conforme</MenuItem>
                    <MenuItem value={'Non_conforme'}>Non conforme</MenuItem>
                    <MenuItem value={'SAV'}>SAV</MenuItem>
                    <MenuItem value={'Annulation'}>Annulation</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </FormGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Calification;
