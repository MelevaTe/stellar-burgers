import React, { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  burgerConstructorSlice,
  getBurgerAllSelector
} from '../../services/BurgerConstructor/slice/BurgerConstructorSlice';
import {
  selectInfoOrder,
  sendOrder,
  selectIsLoading,
  orderSlice
} from '../../services/Order/slice/OrderSlice';
import { selectInited } from '../../services/User/slice/UserSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector(getBurgerAllSelector);
  const orderModalData = useSelector(selectInfoOrder);
  const orderRequest = useSelector(selectIsLoading);
  const isAuthChecked = useSelector(selectInited);
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!isAuthChecked) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderRequest) return;
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    dispatch(sendOrder(ingredientIds));
  };
  const closeOrderModal = () => {
    dispatch(orderSlice.actions.clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
