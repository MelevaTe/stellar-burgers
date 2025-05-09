/// <reference types="cypress" />
import { SELECTORS } from '../support/commands/selectors';

describe('Интеграционное тестирование конструктора бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients' });
    cy.visit('/');
  });

  it('Ингредиенты корректно отображаются на странице', () => {
    cy.get(SELECTORS.INGREDIENT_BUN).should('exist');
    cy.get(SELECTORS.INGREDIENT_MAIN).should('exist');
    cy.get(SELECTORS.INGREDIENT_SAUCE).should('exist');
  });

  context('Проверка окна с информацией об ингредиенте', () => {
    it('Открытие модалки при клике на ингредиент', () => {
      cy.get(SELECTORS.INGREDIENT_MAIN).first().click();
      cy.get(SELECTORS.MODAL_ROOT).should('contain', 'Детали ингредиента');
    });

    it('Окно сохраняется после перезагрузки', () => {
      cy.get(SELECTORS.INGREDIENT_MAIN).first().click();
      cy.reload();
      cy.get(SELECTORS.MODAL_ROOT).should('exist');
    });

    it('Закрытие по нажатию на Escape', () => {
      cy.get(SELECTORS.INGREDIENT_MAIN).first().click();
      cy.get('body').type('{esc}');
      cy.get(SELECTORS.MODAL_ROOT).should('not.contain', 'Детали ингредиента');
    });

    it('Закрытие модалки через клик по оверлею', () => {
      cy.get(SELECTORS.INGREDIENT_BUN).first().click();
      cy.get(`${SELECTORS.MODAL_ROOT} > div`).should('have.length', 2);
      cy.get(`${SELECTORS.MODAL_ROOT} > div`).eq(1).click({ force: true });
      cy.get(SELECTORS.MODAL_ROOT).children().should('have.length', 0);
    });

    it('Закрытие по нажатию на крестик', () => {
      cy.get(SELECTORS.INGREDIENT_MAIN).first().click();
      cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
      cy.get(SELECTORS.MODAL_ROOT).children().should('have.length', 0);
    });
  });

  context('Оформление заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'test-token');
      localStorage.setItem('refreshToken', 'refresh-token');
      cy.intercept('GET', '**/api/auth/user', { fixture: 'user' });
      cy.intercept('POST', '**/api/orders', { fixture: 'order' });
      cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients' });
      cy.visit('/');
    });

    it('Процесс создания заказа проходит успешно', () => {
      cy.get(SELECTORS.INGREDIENT_BUN_BUTTON).first().click();
      cy.get(SELECTORS.INGREDIENT_MAIN_BUTTON).first().click();
      cy.get(SELECTORS.ORDER_BUTTON).should('not.be.disabled');
      cy.get(SELECTORS.ORDER_BUTTON).click();
      cy.get(SELECTORS.MODAL_ROOT, { timeout: 15000 }).contains('76617', { timeout: 15000 });
      cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
      cy.get(SELECTORS.MODAL_ROOT).should('not.contain', '76617');
    });
  });
});
