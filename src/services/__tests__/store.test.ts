import { combineReducers } from '@reduxjs/toolkit';
import { rootReducer } from '../store';
import { initialState as ingredientsInitialState } from '../Ingredients/slice/IngredientsSlice';
import { initialState as feedsInitialState } from '../Feed/slice/FeedSlice';
import { initialState as profileInitialState } from '../Profile/slice/ProfileSlice';
import { initialState as userInitialState } from '../User/slice/UserSlice';
import { initialState as profileOrderInitialState } from '../ProfileOrder/slice/ProfileOrder';
import { initialState as burgerConstructorInitialState } from '../BurgerConstructor/slice/BurgerConstructorSlice';
import { initialState as orderInitialState } from '../Order/slice/OrderSlice';

describe('Тестирование rootReducer', () => {
  const reducer = combineReducers(rootReducer);

  it('возвращает начальное состояние при неизвестном экшене', () => {
    const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: ingredientsInitialState,
      feeds: feedsInitialState,
      profile: profileInitialState,
      user: userInitialState,
      profileOrder: profileOrderInitialState,
      burgerConstructor: burgerConstructorInitialState,
      order: orderInitialState
    });
  });
});
