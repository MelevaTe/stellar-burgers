import {
  burgerConstructorReducer,
  burgerConstructorActions,
  getBurgerAllSelector
} from '../BurgerConstructor/slice/BurgerConstructorSlice';
import { TConstructorIngredient } from '@utils-types';
import { configureStore } from '@reduxjs/toolkit';

describe('Тестирование редьюсера BurgerConstructor', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockIngredient: TConstructorIngredient = {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    id: '1'
  };

  const mockBun: TConstructorIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    id: 'bun1'
  };

  it('должен возвращать начальное состояние', () => {
    expect(burgerConstructorReducer(undefined, { type: '' })).toEqual(
      initialState
    );
  });

  it('должен добавлять ингредиент в список', () => {
    const action = burgerConstructorActions.addIngredients(mockIngredient);
    const newState = burgerConstructorReducer(initialState, action);
    expect(newState.ingredients).toEqual([mockIngredient]);
  });

  it('должен заменять булку', () => {
    const action = burgerConstructorActions.addIngredients(mockBun);
    const newState = burgerConstructorReducer(initialState, action);
    expect(newState.bun).toEqual(mockBun);
  });

  it('должен удалять ингредиент', () => {
    const actionAdd = burgerConstructorActions.addIngredients(mockIngredient);
    const stateAfterAdd = burgerConstructorReducer(initialState, actionAdd);
    const actionRemove = burgerConstructorActions.removeBurgerIngredient(
      mockIngredient.id
    );
    const newState = burgerConstructorReducer(stateAfterAdd, actionRemove);
    expect(newState.ingredients).toEqual([]);
  });

  it('должен очищать все ингредиенты', () => {
    const actionAdd = burgerConstructorActions.addIngredients(mockIngredient);
    const stateAfterAdd = burgerConstructorReducer(initialState, actionAdd);
    const actionClear = burgerConstructorActions.clearIngredietns();
    const newState = burgerConstructorReducer(stateAfterAdd, actionClear);
    expect(newState.ingredients).toEqual([]);
    expect(newState.bun).toBeNull();
  });

  it('должен перемещать ингредиент вверх', () => {
    const ingredient2: TConstructorIngredient = {
      ...mockIngredient,
      id: '2'
    };
    const actionAdd1 = burgerConstructorActions.addIngredients(mockIngredient);
    const actionAdd2 = burgerConstructorActions.addIngredients(ingredient2);
    const stateAfterAdd = burgerConstructorReducer(initialState, actionAdd1);
    const stateAfterAddBoth = burgerConstructorReducer(
      stateAfterAdd,
      actionAdd2
    );

    const actionMoveUp = burgerConstructorActions.moveIngredientUp(
      ingredient2.id
    );
    const newState = burgerConstructorReducer(stateAfterAddBoth, actionMoveUp);

    expect(newState.ingredients[0].id).toBe(ingredient2.id);
  });

  it('должен перемещать ингредиент вниз', () => {
    const ingredient2: TConstructorIngredient = {
      ...mockIngredient,
      id: '2'
    };
    const actionAdd1 = burgerConstructorActions.addIngredients(mockIngredient);
    const actionAdd2 = burgerConstructorActions.addIngredients(ingredient2);
    const stateAfterAdd = burgerConstructorReducer(initialState, actionAdd1);
    const stateAfterAddBoth = burgerConstructorReducer(
      stateAfterAdd,
      actionAdd2
    );

    const actionMoveDown = burgerConstructorActions.moveIngredientDown(
      mockIngredient.id
    );
    const newState = burgerConstructorReducer(
      stateAfterAddBoth,
      actionMoveDown
    );

    expect(newState.ingredients[1].id).toBe(mockIngredient.id);
  });

  describe('тесты селектора getBurgerAllSelector', () => {
    test('получение всех ингредиентов бургера', () => {
      const store = configureStore({
        reducer: {
          burgerConstructor: burgerConstructorReducer
        },
        preloadedState: {
          burgerConstructor: {
            bun: {
              _id: '643d69a5c3f7b9001cfa093c',
              name: 'Краторная булка N-200i',
              type: 'bun',
              proteins: 80,
              fat: 24,
              carbohydrates: 53,
              calories: 420,
              price: 1255,
              image: 'https://code.s3.yandex.net/react/code/bun-02.png',
              image_large:
                'https://code.s3.yandex.net/react/code/bun-02-large.png',
              image_mobile:
                'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
              id: '1'
            } as TConstructorIngredient,
            ingredients: [
              {
                _id: '643d69a5c3f7b9001cfa093e',
                name: 'Филе Люминесцентного тетраодонтимформа',
                type: 'main',
                proteins: 44,
                fat: 26,
                carbohydrates: 85,
                calories: 643,
                price: 988,
                image: 'https://code.s3.yandex.net/react/code/meat-03.png',
                image_large:
                  'https://code.s3.yandex.net/react/code/meat-03-large.png',
                image_mobile:
                  'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
                id: '2'
              } as TConstructorIngredient,
              {
                _id: '643d69a5c3f7b9001cfa093e',
                name: 'Филе Люминесцентного тетраодонтимформа',
                type: 'main',
                proteins: 44,
                fat: 26,
                carbohydrates: 85,
                calories: 643,
                price: 988,
                image: 'https://code.s3.yandex.net/react/code/meat-03.png',
                image_large:
                  'https://code.s3.yandex.net/react/code/meat-03-large.png',
                image_mobile:
                  'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
                id: '3'
              } as TConstructorIngredient
            ]
          }
        }
      });

      const burgerData = getBurgerAllSelector(store.getState());

      expect(burgerData).toEqual({
        bun: {
          _id: '643d69a5c3f7b9001cfa093c',
          name: 'Краторная булка N-200i',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'https://code.s3.yandex.net/react/code/bun-02.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
          id: '1'
        },
        ingredients: [
          {
            _id: '643d69a5c3f7b9001cfa093e',
            name: 'Филе Люминесцентного тетраодонтимформа',
            type: 'main',
            proteins: 44,
            fat: 26,
            carbohydrates: 85,
            calories: 643,
            price: 988,
            image: 'https://code.s3.yandex.net/react/code/meat-03.png',
            image_large:
              'https://code.s3.yandex.net/react/code/meat-03-large.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
            id: '2'
          } as TConstructorIngredient,
          {
            _id: '643d69a5c3f7b9001cfa093e',
            name: 'Филе Люминесцентного тетраодонтимформа',
            type: 'main',
            proteins: 44,
            fat: 26,
            carbohydrates: 85,
            calories: 643,
            price: 988,
            image: 'https://code.s3.yandex.net/react/code/meat-03.png',
            image_large:
              'https://code.s3.yandex.net/react/code/meat-03-large.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
            id: '3'
          } as TConstructorIngredient
        ]
      });
    });

    test('если нет булки в конструкторе', () => {
      const store = configureStore({
        reducer: {
          burgerConstructor: burgerConstructorReducer
        },
        preloadedState: {
          burgerConstructor: {
            bun: null,
            ingredients: [
              {
                _id: '643d69a5c3f7b9001cfa093e',
                name: 'Филе Люминесцентного тетраодонтимформа',
                type: 'main',
                proteins: 44,
                fat: 26,
                carbohydrates: 85,
                calories: 643,
                price: 988,
                image: 'https://code.s3.yandex.net/react/code/meat-03.png',
                image_large:
                  'https://code.s3.yandex.net/react/code/meat-03-large.png',
                image_mobile:
                  'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
                id: '2'
              } as TConstructorIngredient,
              {
                _id: '643d69a5c3f7b9001cfa093e',
                name: 'Филе Люминесцентного тетраодонтимформа',
                type: 'main',
                proteins: 44,
                fat: 26,
                carbohydrates: 85,
                calories: 643,
                price: 988,
                image: 'https://code.s3.yandex.net/react/code/meat-03.png',
                image_large:
                  'https://code.s3.yandex.net/react/code/meat-03-large.png',
                image_mobile:
                  'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
                id: '3'
              } as TConstructorIngredient
            ]
          }
        }
      });

      const burgerData = getBurgerAllSelector(store.getState());

      expect(burgerData).toEqual({
        bun: null,
        ingredients: [
          {
            _id: '643d69a5c3f7b9001cfa093e',
            name: 'Филе Люминесцентного тетраодонтимформа',
            type: 'main',
            proteins: 44,
            fat: 26,
            carbohydrates: 85,
            calories: 643,
            price: 988,
            image: 'https://code.s3.yandex.net/react/code/meat-03.png',
            image_large:
              'https://code.s3.yandex.net/react/code/meat-03-large.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
            id: '2'
          } as TConstructorIngredient,
          {
            _id: '643d69a5c3f7b9001cfa093e',
            name: 'Филе Люминесцентного тетраодонтимформа',
            type: 'main',
            proteins: 44,
            fat: 26,
            carbohydrates: 85,
            calories: 643,
            price: 988,
            image: 'https://code.s3.yandex.net/react/code/meat-03.png',
            image_large:
              'https://code.s3.yandex.net/react/code/meat-03-large.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
            id: '3'
          } as TConstructorIngredient
        ]
      });
    });
  });
});
