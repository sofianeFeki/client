import HomePage from './component/pages/home';
import SignIn from './component/Login';
import { Box } from '@mui/system';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { auth } from './component/sevices/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { currentUser } from './functions/auth';
import Layout from './component/Layout';
import RequireAuth from './component/Routes/RequireAuth';
import KomparAppBar from './component/AppBar';
import Quality from './component/pages/quality';
import WelcomeCall from './component/pages/wc';
import Admin from './component/pages/admin';
import Support from './component/pages/support';
import AdminRoute from './component/Routes/AdminRoute';
import Missing from './component/Routes/Missing';
import ContractsList from './component/pages/admin/ContractsList';
import ContractDetail from './component/pages/admin/ContractDetail';
import ContractCreate from './component/pages/admin/ContractCreate';
import { DrawerHeader } from './component/AppBar/SideList';
import BackOffice from './component/pages/backOffice';
import AdminDashboard from './component/pages/admin';
import ContractUpdate from './component/pages/admin/ContractUpdate';
import Sav from './component/pages/Sav.js';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));
  const history = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        //console.log('user', user);
        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: 'LOGGED_IN_USER',
              payload: {
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
          })

          .catch((err) => console.log(err));
      }
    });
    return () => unsubscribe();
  }, []);
    const [dark, setDark] = useState(true);
  
   const darkTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: dark ? 'dark' : 'light',
        },
      }),
    [dark]
  );


  return (
    <Box>
  <ThemeProvider theme={darkTheme}>
        <KomparAppBar setDark={setDark} dark={dark} />
        <ToastContainer />
          <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/login" element={<SignIn />} />
          <Route element={<RequireAuth allowedRoles={['admin', 'qualite']} />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/quality" element={<Quality />} />
            <Route path="/contract/:slug" element={<ContractDetail />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={['admin', 'wc']} />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/welcome-call" element={<WelcomeCall />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={['admin', 'support']} />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/support" element={<Support />} />
          </Route>
          <Route path="*" element={<Missing />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/contract" element={<ContractCreate />} />
            <Route path="/back-office" element={<BackOffice />} />
            <Route path="/contract-update/:slug" element={<ContractUpdate />} />
            <Route path="/sav" element={<Sav />} />
          </Route>
        </Route>
      </Routes>
      </ThemeProvider>
    </Box>
  );
};

export default App;
