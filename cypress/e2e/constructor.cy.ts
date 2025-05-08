/// <reference types="cypress" />

describe('Интеграционное тестирование конструктора бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients' });
    cy.visit('http://localhost:4000/');
  });

  it('Ингредиенты корректно отображаются на странице', () => {
    cy.get('[data-ingredient="bun"]').should('exist');
    cy.get('[data-ingredient="main"]').should('exist');
    cy.get('[data-ingredient="sauce"]').should('exist');
  });

  context('Проверка окна с информацией об ингредиенте', () => {
    it('Открытие модалки при клике на ингредиент', () => {
      cy.get('[data-ingredient="main"]').first().click();
      cy.get('#modals').should('contain', 'Детали ингредиента');
    });

    it('Окно сохраняется после перезагрузки', () => {
      cy.get('[data-ingredient="main"]').first().click();
      cy.reload();
      cy.get('#modals').should('exist');
    });

    it('Закрытие по нажатию на Escape', () => {
      cy.get('[data-ingredient="main"]').first().click();
      cy.get('body').type('{esc}');
      cy.get('#modals').should('not.contain', 'Детали ингредиента');
    });

    it('Закрытие модалки через клик по оверлею', () => {
      cy.get('[data-ingredient="bun"]').first().click();
      cy.get('#modals > div').should('have.length', 2);
      cy.get('#modals > div').eq(1).click({ force: true });
      cy.get('#modals').children().should('have.length', 0);
    });

    it('Закрытие по нажатию на крестик', () => {
      cy.get('[data-ingredient="main"]').first().click();
      cy.get('[data-cy="modal-close-button"]').click();
      cy.get('#modals').children().should('have.length', 0);
    });
  });

  context('Оформление заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'test-token');
      localStorage.setItem('refreshToken', 'refresh-token');
      cy.intercept('GET', '**/api/auth/user', { fixture: 'user' });
      cy.intercept('POST', '**/api/orders', { fixture: 'order' });
      cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients' });
      cy.visit('http://localhost:4000/');
    });

    it('Процесс создания заказа проходит успешно', () => {
      cy.get('[data-ingredient="bun"] button').first().click();
      cy.get('[data-ingredient="main"] button').first().click();
      cy.get('[data-order-button]').should('not.be.disabled');
      cy.get('[data-order-button]').click();
      cy.get('#modals', { timeout: 15000 }).contains('76617', { timeout: 15000 });
      cy.get('[data-cy="modal-close-button"]').click();
      cy.get('#modals').should('not.contain', '76617');
    });
  });
});
