Cypress.Commands.add("openHomePage", () => {
  cy.visit("/");
});

Cypress.Commands.add("loginToApplication", () => {
  cy.visit("https://conduit.bondaracademy.com/login");
  cy.get("[placeholder='Email']").type("adi@gmail.com");
  cy.get("[placeholder='Password']").type("adi");
  cy.get('button[type="submit"]').click(); // or cy.get('form').submit();
});
