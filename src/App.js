import { Routes, Route, useNavigate } from 'react-router-dom';
import { auth } from './component/sevices/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState, lazy, Suspense } from 'react';
import { currentUser } from './functions/auth';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress } from '@mui/material';

const RequireAuth = lazy(() => import('./component/Routes/RequireAuth'));
const KomparAppBar = lazy(() => import('./component/AppBar'));
const Quality = lazy(() => import('./component/pages/quality'));
const WelcomeCall = lazy(() => import('./component/pages/wc'));
const Support = lazy(() => import('./component/pages/support'));
const AdminRoute = lazy(() => import('./component/Routes/AdminRoute'));
const Missing = lazy(() => import('./component/Routes/Missing'));
const ContractDetail = lazy(() =>
  import('./component/pages/admin/ContractDetail')
);
const ContractCreate = lazy(() =>
  import('./component/pages/admin/ContractCreate')
);
const BackOffice = lazy(() => import('./component/pages/backOffice'));
const AdminDashboard = lazy(() => import('./component/pages/admin'));
const ContractUpdate = lazy(() =>
  import('./component/pages/admin/ContractUpdate')
);
const Sav = lazy(() => import('./component/pages/Sav.js'));
const Layout = lazy(() => import('./component/Layout'));
const SignIn = lazy(() => import('./component/Login'));

const App = () => {
  const dispatch = useDispatch();

  const [dark, setDark] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
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
                  name: res.data.name,
                },
              });
            })
            .catch((err) => console.log(err));
        }
      } catch (error) {
        console.error(error);
      }
    });
    return () => unsubscribe();
  }, []);
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
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </div>
      }
    >
      <ThemeProvider theme={darkTheme}>
        <KomparAppBar setDark={setDark} dark={dark} />
        <ToastContainer />

        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/login" element={<SignIn />} />
            <Route path="*" element={<Missing />} />
            <Route
              element={
                <RequireAuth
                  allowedRoles={['admin', 'quality', 'wc', 'sav', 'backOffice']}
                />
              }
            >
              <Route path="/contract/:slug" element={<ContractDetail />} />
            </Route>
            <Route
              element={<RequireAuth allowedRoles={['admin', 'quality']} />}
            >
              <Route path="/quality" element={<Quality />} />
            </Route>
            <Route element={<RequireAuth allowedRoles={['admin', 'wc']} />}>
              <Route path="/welcome-call" element={<WelcomeCall />} />
            </Route>

            <Route
              element={<RequireAuth allowedRoles={['admin', 'support']} />}
            >
              <Route path="/support" element={<Support />} />
            </Route>
            <Route
              element={<RequireAuth allowedRoles={['admin', 'backOffice']} />}
            >
              <Route path="/back-office" element={<BackOffice />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={['admin', 'sav']} />}>
              <Route path="/sav" element={<Sav />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/contract" element={<ContractCreate />} />
              <Route
                path="/contract-update/:slug"
                element={<ContractUpdate />}
              />
            </Route>
          </Route>
        </Routes>
      </ThemeProvider>
    </Suspense>
  );
};

export default App;
