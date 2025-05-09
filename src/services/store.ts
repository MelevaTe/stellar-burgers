import { configureStore } from '@reduxjs/toolkit';
import { ingredienReducer } from '../services/Ingredients/slice/IngredientsSlice';
import { feedReducer } from './Feed/slice/FeedSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { profileReducer } from './Profile/slice/ProfileSlice';
import { userReducer } from './User/slice/UserSlice';
import { profileOrderReducer } from './ProfileOrder/slice/ProfileOrder';
import { burgerConstructorReducer } from './BurgerConstructor/slice/BurgerConstructorSlice';
import { orderReducer } from './Order/slice/OrderSlice';

export const rootReducer = {
  ingredients: ingredienReducer,
  feeds: feedReducer,
  profile: profileReducer,
  user: userReducer,
  profileOrder: profileOrderReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderReducer
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
