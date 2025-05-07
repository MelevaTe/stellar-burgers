import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { ReactElement } from 'react';
import { selectUser } from '../../services/User/slice/UserSlice';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  element: ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  element
}: TProtectedRouteProps): ReactElement => {
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state ?? { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  return element;
};
