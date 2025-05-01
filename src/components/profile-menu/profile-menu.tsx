import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { Preloader, ProfileMenuUI } from '@ui';
import {
  logoutUser,
  selectIsLoading
} from '../../services/User/slice/UserSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
