import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Auth from './Auth';

const RequireAuth = ({ allowedRoles }) => {
  const { user } = useSelector((state) => ({ ...state }));

  // const [useInTheState, setUserInTheState] = useState(['']);

  // useEffect(() => {
  //   if (user && user.token) {
  //     useInTheState.push(user.role);
  //     console.log(useInTheState);
  //   } else {
  //     console.log('nothong to see');
  //   }
  // }, [user]);

  //const [user, setUser] = useState(true);

  const location = useLocation();

  return allowedRoles.find((role) => user && user.role.includes(role)) ? (
    <Outlet />
  ) : user && user?.token ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Auth />
  );
};

export default RequireAuth;
