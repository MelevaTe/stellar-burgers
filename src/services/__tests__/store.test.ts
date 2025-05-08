import { combineReducers } from '@reduxjs/toolkit';
import { rootReducer } from '../store';

describe('Тестирование rootReducer', () => {
  const reducer = combineReducers(rootReducer);

  it('возвращает начальное состояние при неизвестном экшене', () => {
    const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: expect.any(Object),
      feeds: expect.any(Object),
      profile: expect.any(Object),
      user: expect.any(Object),
      profileOrder: expect.any(Object),
      burgerConstructor: expect.any(Object),
      order: expect.any(Object)
    });
  });
});
