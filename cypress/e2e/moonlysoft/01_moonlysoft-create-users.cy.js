/// <reference types="cypress" />

import Generic from "../../support/page_objects/moonlysoft/generic";

const newUser = {
  "user-name": "Adrian",
  "user-surname": "Marincean Test",
  "user-email": "adi@gmail.com",
  "user-phone-number": "0755979606",
  type: "Consultant",
};

describe("Moonlysoft", () => {
  beforeEach(() => {
    cy.visit("https://met.moonlysoft.org/").then(() => {
      cy.on("window:prompt", () => false);
    });

    cy.get("#email-login").type("admin@moonlysoft.com");
    cy.get("#-password-login").type("admin123");
    cy.get('button[type="submit"]').contains("Login").click();
  });

  it("Create new users", () => {
    Generic.clickOnAddRecordFor("Utilizatori");

    cy.get("#user-name").type(newUser["user-name"]);
    cy.get("#user-surname").type(newUser["user-surname"]);
    cy.get("#user-email").type(newUser["user-email"]);
    cy.get("#user-phone-number").type(newUser["user-phone-number"]);
    cy.get("form #column-hiding").click({ force: true });
    cy.get('ul li[data-value="CAM_CONSULTANT"]').click();

    cy.get("form button[type='submit']").contains("Add").click();

    Generic.checkErrorModal();
  });

  it("Check newly created user", () => {
    Generic.clickOnMenuLeaf("Utilizatori");
    Generic.filterResult(newUser["user-surname"]);
    Generic.checkFilteredResults(
      newUser["user-surname"],
      newUser["user-email"],
      newUser.type
    );
  });
});
