import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeeds,
  selectFeeds,
  selectIsLoading
} from '../../services/Feed/slice/FeedSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const orders = useSelector(selectFeeds);
  const isLoading = useSelector(selectIsLoading);

  if (isLoading) {
    return <Preloader />;
  }
  return (
    <FeedUI
      orders={orders?.orders || []}
      handleGetFeeds={() => dispatch(fetchFeeds())}
    />
  );
};
