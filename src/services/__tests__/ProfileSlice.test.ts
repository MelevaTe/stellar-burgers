import { configureStore, Store } from '@reduxjs/toolkit';
import {
  initialState,
  profileReducer,
  fetchProfile,
  selectProfile,
  selectIsLoading
} from '../Profile/slice/ProfileSlice';

describe('profileSlice - Профиль пользователя', () => {
  let store: Store<{ profile: ReturnType<typeof profileReducer> }>;

  const mockUser = {
    email: 'test@mail.ru',
    name: 'Test Test'
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        profile: profileReducer
      }
    });
  });

  test('начальное состояние соответствует ожидаемому', () => {
    const state = store.getState().profile;
    expect(state).toEqual(initialState);
  });

  test('fetchProfile.pending устанавливает isLoading в true', () => {
    store.dispatch(fetchProfile.pending('requestId'));
    const state = store.getState().profile;

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  test('fetchProfile.fulfilled обновляет данные пользователя', () => {
    const response = {
      success: true,
      user: mockUser
    };

    store.dispatch(fetchProfile.fulfilled(mockUser, 'requestId'));
    const state = store.getState().profile;

    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(mockUser);
    expect(state.error).toBeUndefined();
  });

  test('fetchProfile.rejected устанавливает сообщение об ошибке', () => {
    const errorMessage = 'Ошибка при получении данных профиля';

    store.dispatch(fetchProfile.rejected(new Error(errorMessage), 'requestId'));
    const state = store.getState().profile;

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('selectProfile возвращает данные пользователя', () => {
    store.dispatch(fetchProfile.fulfilled(mockUser, 'requestId'));

    const result = selectProfile(store.getState());
    expect(result).toEqual(mockUser);
  });

  test('selectIsLoading возвращает флаг загрузки', () => {
    store.dispatch(fetchProfile.pending('requestId'));
    expect(selectIsLoading(store.getState())).toBe(true);

    store.dispatch(fetchProfile.fulfilled(mockUser, 'requestId'));
    expect(selectIsLoading(store.getState())).toBe(false);
  });
});
