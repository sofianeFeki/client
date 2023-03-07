import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { currentAdmin } from '../../functions/auth';

const AdminRoute = () => {
  const { user } = useSelector((state) => ({ ...state }));

  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (user && user.token) {
      currentAdmin(user.token)
        .then((res) => {
          console.log(res);
          setOk(true);
        })
        .catch((err) => {
          console.log(err);
          setOk(false);
        });
    }
  }, [user]);

  // const location = useLocation();

  return ok ? <Outlet /> : <h1>checking account role and token...</h1>;
};

export default AdminRoute;
