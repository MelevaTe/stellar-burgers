import { configureStore, Store } from '@reduxjs/toolkit';
import {
  userReducer,
  registerUser,
  loginUser,
  logoutUser,
  editUser,
  getUser,
  selectUser,
  selectInited,
  selectIsLoading
} from '../User/slice/UserSlice';

describe('userSlice - Пользователь', () => {
  let store: Store<{ user: ReturnType<typeof userReducer> }>;

  const mockUser = {
    email: 'test@mail.ru',
    name: 'Test Test'
  };

  const mockRegisterData = {
    email: 'test@mail.ru',
    password: 'Qwer12345as',
    name: 'Test Test'
  };

  const mockLoginData = {
    email: 'test@mail.ru',
    password: 'Qwer12345as'
  };

  const mockEditData = {
    email: 'test@mail.ru',
    name: 'New test'
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer
      }
    });
  });

  test('начальное состояние соответствует ожидаемому', () => {
    const state = store.getState().user;
    expect(state).toEqual({
      data: null,
      _inited: false,
      isLoading: false,
      error: undefined
    });
  });

  test('registerUser.pending устанавливает isLoading в true', () => {
    store.dispatch(registerUser.pending('requestId', mockRegisterData));
    const state = store.getState().user;

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  test('registerUser.fulfilled сохраняет пользователя', () => {
    store.dispatch(
      registerUser.fulfilled(mockUser, 'requestId', mockRegisterData)
    );
    const state = store.getState().user;

    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(mockUser);
    expect(state.error).toBeUndefined();
  });

  test('registerUser.rejected устанавливает сообщение об ошибке', () => {
    const errorMessage = 'Ошибка, не удалось зарегистрироваться';

    store.dispatch(
      registerUser.rejected(
        new Error(errorMessage),
        'requestId',
        mockRegisterData
      )
    );
    const state = store.getState().user;

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('loginUser.pending устанавливает isLoading в true', () => {
    store.dispatch(loginUser.pending('requestId', mockLoginData));
    const state = store.getState().user;

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  test('loginUser.fulfilled сохраняет пользователя и устанавливает _inited', () => {
    store.dispatch(loginUser.fulfilled(mockUser, 'requestId', mockLoginData));
    const state = store.getState().user;

    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(mockUser);
    expect(state._inited).toBe(true);
    expect(state.error).toBeUndefined();
  });

  test('loginUser.rejected устанавливает сообщение об ошибке', () => {
    const errorMessage = 'Ошибка, неверный email или пароль';

    store.dispatch(
      loginUser.rejected(new Error(errorMessage), 'requestId', mockLoginData)
    );
    const state = store.getState().user;

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('logoutUser.pending устанавливает isLoading в true', () => {
    store.dispatch(logoutUser.pending('requestId'));
    const state = store.getState().user;

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  test('logoutUser.fulfilled очищает данные пользователя', () => {
    store.dispatch(loginUser.fulfilled(mockUser, 'requestId', mockLoginData));

    store.dispatch(logoutUser.fulfilled({ success: true }, 'requestId'));

    const state = store.getState().user;

    expect(state.isLoading).toBe(false);
    expect(state.data).toBeNull();
    expect(state._inited).toBe(false);
  });

  test('logoutUser.rejected устанавливает сообщение об ошибке', () => {
    const errorMessage = 'Ошибка, не удалось выполнить выход';

    store.dispatch(logoutUser.rejected(new Error(errorMessage), 'requestId'));
    const state = store.getState().user;

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('editUser.pending устанавливает isLoading в true', () => {
    store.dispatch(editUser.pending('requestId', mockEditData));
    const state = store.getState().user;

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  test('editUser.fulfilled обновляет данные пользователя', () => {
    store.dispatch(loginUser.fulfilled(mockUser, 'requestId', mockLoginData));

    store.dispatch(
      editUser.fulfilled(
        { ...mockUser, name: 'New test' },
        'requestId',
        mockEditData
      )
    );
    const state = store.getState().user;

    expect(state.isLoading).toBe(false);
    expect(state.data?.name).toBe('New test');
    expect(state._inited).toBe(true);
  });

  test('editUser.rejected устанавливает сообщение об ошибке', () => {
    const errorMessage = 'Ошибка, не удалось обновить профиль';

    store.dispatch(
      editUser.rejected(new Error(errorMessage), 'requestId', mockEditData)
    );
    const state = store.getState().user;

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('getUser.pending устанавливает isLoading в true', () => {
    store.dispatch(getUser.pending('requestId'));
    const state = store.getState().user;

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  test('getUser.fulfilled загружает данные пользователя', () => {
    store.dispatch(getUser.fulfilled(mockUser, 'requestId'));
    const state = store.getState().user;

    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(mockUser);
    expect(state._inited).toBe(true);
  });

  test('getUser.rejected устанавливает сообщение об ошибке', () => {
    const errorMessage = 'Ошибка не удалось получить данные профиля';

    store.dispatch(getUser.rejected(new Error(errorMessage), 'requestId'));
    const state = store.getState().user;

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('selectUser возвращает данные пользователя', () => {
    store.dispatch(loginUser.fulfilled(mockUser, 'requestId', mockLoginData));

    const result = selectUser(store.getState());
    expect(result).toEqual(mockUser);
  });

  test('selectInited возвращает флаг _inited', () => {
    store.dispatch(loginUser.fulfilled(mockUser, 'requestId', mockLoginData));

    expect(selectInited(store.getState())).toBe(true);

    store.dispatch(getUser.fulfilled(mockUser, 'requestId'));

    expect(selectInited(store.getState())).toBe(true);
  });

  test('selectIsLoading возвращает флаг загрузки', () => {
    store.dispatch(loginUser.pending('requestId', mockLoginData));
    expect(selectIsLoading(store.getState())).toBe(true);

    store.dispatch(loginUser.fulfilled(mockUser, 'requestId', mockLoginData));
    expect(selectIsLoading(store.getState())).toBe(false);
  });
});
