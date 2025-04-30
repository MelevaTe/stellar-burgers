import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import { burgerConstructorSlice } from '../../services/BurgerConstructor/slice/BurgerConstructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(
        burgerConstructorSlice.actions.moveIngredientDown(ingredient.id)
      );
    };

    const handleMoveUp = () => {
      dispatch(burgerConstructorSlice.actions.moveIngredientUp(ingredient.id));
    };

    const handleClose = () => {
      dispatch(
        burgerConstructorSlice.actions.removeBurgerIngredient(ingredient.id)
      );
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
