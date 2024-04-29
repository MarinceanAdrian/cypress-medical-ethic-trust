/// <reference types="cypress" />

describe("Moonlysoft", () => {
  beforeEach(() => {
    cy.visit("https://met.moonlysoft.org/").then(() => {
      cy.on("window:prompt", () => false);
    });

    cy.get("#email-login").type("admin@moonlysoft.com");
    cy.get("#-password-login").type("admin123");
    cy.get('button[type="submit"]').contains("Login").click();
  });

  it("Check that the logged in user is the right one", () => {
    cy.get('header button[aria-label="open profile"]').click();
    cy.get('header button[aria-label="open profile"]')
      .next()
      .then((card) => {
        cy.wrap(card).find("h6").should("contain", "Ioan Solovastru");
      });
  });

  it("Check that upon clicking the icon from the top left we are redirected to the main site", () => {
    cy.intercept("GET", "https://supa-met.moonlysoft.org/rest/v1/user?***").as(
      "waitForLogin"
    );
    cy.wait("@waitForLogin", { timeout: 5000 });
    cy.get("img[alt='icon logo']")
      .as("img")
      .parent()
      .then((a) => {
        expect(a).to.have.attr("href");
      });
    cy.get("@img").click();
    cy.visit("https://medicaltrust.ro/");
  });

  // Prerequisite for: Check menu tree labels consistence upon clicking and no system errors are displayed
  it("Register all menu tree labels", () => {
    // Get all menu tree labels
    cy.get("a.MuiButtonBase-root h6").each((menuTree) => {
      console.log(menuTree);
      menuTreeLabels.push(menuTree.text());
    });
  });

  it("Check menu tree labels consistence upon clicking and no system errors are displayed", () => {
    cy.intercept("GET", "http://157.230.111.110/rest/v1/***").as("request");
    cy.wrap(menuTreeLabels).each((menuTreeLabel) => {
      cy.get("a.MuiButtonBase-root h6").contains(menuTreeLabel).click();
      cy.get(".MuiTypography-root.MuiTypography-h2").should(
        "contain",
        menuTreeLabel
      );
      cy.get(".MuiContainer-root").then((page) => {
        cy.wait(1000);
        cy.wrap(page).should("exist");
        cy.wrap(page).should("not.contain", "Error");
      });
    });
  });

  it("Check Clients export to CSV is working properly", () => {
    cy.get("a.MuiButtonBase-root h6").contains("Clienti").click();
    cy.get('[aria-label="CSV Export"]').click();
    cy.readFile(
      Cypress.config("downloadsFolder") + "/" + "clients-list.csv"
    ).should("exist");
  });
});
