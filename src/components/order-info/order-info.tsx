import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '@ui';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import {
  getOrderByNumber,
  selectInfoOrder
} from '../../services/Order/slice/OrderSlice';
import { selectIngredients } from '../../services/Ingredients/slice/IngredientsSlice';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';

export const OrderInfo: FC = () => {
  const id = useParams().number;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrderByNumber(Number(id)));
  }, [dispatch, id]);

  const orderData = useSelector(selectInfoOrder);
  const ingredients = useSelector(selectIngredients) || [];

  /** TODO: взять переменные orderData и ingredients из стора */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
