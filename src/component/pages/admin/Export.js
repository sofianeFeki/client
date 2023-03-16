import { useState } from 'react';
import moment from 'moment';
import * as XLSX from 'xlsx/xlsx.mjs';
import { getContractsAll } from '../../../functions/product';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LoadingButton from '@mui/lab/LoadingButton';

const Export = ({ filterValues }) => {
  const [loading, setLoading] = useState(false);
  const handleDownloadClick = () => {
    setLoading(true);
    getContractsAll(filterValues)
      .then((response) => {
        const data = response.data;
        // Create a new array with correct headers
        const newData = data.map((contract) => ({
          _id: contract._id,
          QualificationQalité: contract.quality?.qualification || '',
          QualificationSav: contract.sav?.qualification || '',
          QualificationWc: contract.wc?.qualification || '',
          contratRef: contract.contratRef,
          clientRef: contract.clientRef,
          Civility: contract.Civility,
          Prénom: contract.Prénom,
          Nom: contract.Nom,
          Adresse: contract.Adresse,
          CodePostal: contract.CodePostal,
          Commune: contract.Commune,
          Énergie: contract.Énergie,
          PDL: contract.PDL,
          Puissance: contract.Puissance,
          offre: contract.offre,
          statut: contract.statut,
          partenaire: contract.partenaire,
          date_début: moment(contract.date_début).format('DD/MM/YYYY'),
          date_signature: moment(contract.date_signature).format('DD/MM/YYYY'),
          createdAt: moment(contract.createdAt).format('DD/MM/YYYY HH:mm:ss'),
          updatedAt: moment(contract.updatedAt).format('DD/MM/YYYY HH:mm:ss'),
          email: contract.email,
          mensualité: contract.mensualité,
          tel: contract.tel,
        }));

        const jsonSheet = XLSX.utils.json_to_sheet(newData, {
          dateNF: 'yyyy-mm-dd',
          cellDates: true,
          strip: false,
          blankrows: true,
        });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, jsonSheet, 'Data');
        XLSX.writeFile(workbook, 'data.xlsx');
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <LoadingButton
        loading={loading}
        loadingPosition="start"
        variant="outlined"
        startIcon={<FileDownloadIcon />}
        onClick={handleDownloadClick}
      >
        Exporter
      </LoadingButton>
    </div>
  );
};

export default Export;
