import axios from 'axios';

const API_BASE_URL = 'https://komparcrmserver.onrender.com/api'

export const createContract = async (contract, authtoken) =>
  await axios.post(`${API_BASE_URL}/contract`, contract, {
    headers: {
      authtoken,
    },
  });

// //export const getContracts = async (sort, order, page) =>
//   await axios.post('http://localhost:8000/api/contracts', {
//     sort,
//     order,
//     page,
//   });

export const getContractsAll = async (sort, order, page, filter, quickFilter) =>
  await axios.post('http://localhost:8000/api/contracts', {
    sort,
    order,
    page,
    filter,
    quickFilter,
  });

export const getContractsPagintationCursor = async (cursor, pageSize, page) =>
  await axios.post(`${API_BASE_URL}/contractsPagintationCursor`, {
    cursor,
    pageSize,
    page,
  });

export const qualityContractsPaginationCursor = async (
  cursor,
  pageSize,
  page
) =>
  await axios.post(`${API_BASE_URL}/qualityContractsPaginationCursor`, {
    cursor,
    pageSize,
    page,
  });

export const getContractsFilters = async (
  filterOptions,
  quickFilterValue,
  sortOptions
) =>
  await axios.post(`${API_BASE_URL}/ContractsFilters`, {
    filterOptions,
    quickFilterValue,
    sortOptions,
  });

export const getContractsCount = async () =>
  await axios.get(`${API_BASE_URL}/contracts/total`);

export const getContract = async (slug) =>
  await axios.get(`${API_BASE_URL}/contract/${slug}`);

export const getContractsSav = async (arg) =>
  await axios.post(`${API_BASE_URL}/contracts/sav`, arg);

export const fetchContractByFilter = async (arg) =>
  await axios.post(`${API_BASE_URL}/search/filter`, arg);

export const removeContract = async (_id, authtoken) =>
  await axios.delete(`${API_BASE_URL}/contract/${_id}`, {
    headers: {
      authtoken,
    },
  });

export const updateContract = async (slug, values, authtoken) =>
  await axios.put(`${API_BASE_URL}/contract/update/quality/${slug}`, values, {
    headers: {
      authtoken,
    },
  });
export const updateContractData = async (slug, values, authtoken) =>
  await axios.put(`${API_BASE_URL}/contract/update/data/${slug}`, values, {
    headers: {
      authtoken,
    },
  });
export const updateContractSav = async (slug, values, authtoken) =>
  await axios.put(`${API_BASE_URL}/contract/update/sav/${slug}`, values, {
    headers: {
      authtoken,
    },
  });
export const updateContractWc = async (slug, values, authtoken) =>
  await axios.put(`${API_BASE_URL}/contract/update/wc/${slug}`, values, {
    headers: {
      authtoken,
    },
  });
export const getWcContract = async (arg) =>
  await axios.post(`${API_BASE_URL}/contracts/welcome-call`, arg);
