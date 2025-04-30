import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds, selectFeeds } from '../../services/Feed/slice/FeedSlice';
import {
  fetchProfileOrder,
  selectProfileOrder
} from '../../services/ProfileOrder/slice/ProfileOrder';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProfileOrder());
  }, [dispatch]);

  const orders = useSelector(selectProfileOrder) || [];

  return <ProfileOrdersUI orders={orders} />;
};
