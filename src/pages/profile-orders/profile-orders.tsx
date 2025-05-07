import { ProfileOrdersUI } from '@ui-pages';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchProfileOrder,
  selectIsLoading,
  selectProfileOrder
} from '../../services/ProfileOrder/slice/ProfileOrder';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */

  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    dispatch(fetchProfileOrder());
  }, [dispatch]);

  const orders = useSelector(selectProfileOrder) || [];

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
