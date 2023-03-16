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
import { getContract, updateContractSav } from '../../../functions/product';
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

const CalificationSav = () => {
  let { slug } = useParams();
  const history = useNavigate();
  const { user } = useSelector((state) => ({ ...state }));
  const [open, setOpen] = useState(false);
  const [qualification, setQualification] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    loadContract();
  }, []);

  const loadContract = () => {
    getContract(slug).then((p) => {
      console.log(p.data.quality.values);
      const sav = p.data.sav || {}; // default to empty object if quality is not provided

      setQualification(p.data.sav.qualification || '');
      setComment(p.data.sav.comment || '');
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const values = {
      qualification: qualification,
      comment: comment,
    };

    console.log(values);
    toast
      .promise(updateContractSav(slug, values, user.token), {
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

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleQualificationChange = (event) => {
    setQualification(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        SAV
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          sav qualification
        </DialogTitle>
        <DialogContent>
          <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
            <FormGroup>
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
                    <MenuItem value={'validé'}>validé</MenuItem>
                    <MenuItem value={'A_relancer'}>A relancer</MenuItem>
                    <MenuItem value={'annulation'}>Annulation</MenuItem>
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
          <Button onClick={handleSubmit}>save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CalificationSav;
