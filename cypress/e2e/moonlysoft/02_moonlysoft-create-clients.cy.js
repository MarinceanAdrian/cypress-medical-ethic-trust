/// <reference types="cypress" />

import Generic from "../../support/page_objects/moonlysoft/generic";

let menuTreeLabels = [];

const newClient = {
  "company-name": "Company Test SRL",
  updatedCompanyName: "Company Test SRL UPDATED",
  alias: "CTEST",
  cui: "123456789",
  "bank-account": "CTEST98765432198765432TT",
  website: "https://www.google.com/",
  email: "companytest@test.com",
  address: "Test Adress 1st",
};

const consultantUser = {
  "user-name": "Adrian",
  "user-surname": "Marincean Test",
};

describe("Moonlysoft", () => {
  beforeEach(() => {
    cy.visit("https://met.moonlysoft.org/");

    cy.get("#email-login").type("admin@moonlysoft.com");
    cy.get("#-password-login").type("admin123");
    cy.get('button[type="submit"]').contains("Login").click();
  });

  it.skip("Create new clients", () => {
    cy.intercept(
      "POST",
      "https://supa-met.moonlysoft.org/rest/v1/client?***"
    ).as("createClientHTTP");

    Generic.clickOnAddRecordFor("Clienti");

    // Date companie
    cy.get("#company-name", { timeout: 10000 }).type(newClient["company-name"]);
    cy.get("#alias").type(newClient["alias"]);
    cy.get("#cui").type(newClient["cui"]);
    cy.get("#bank-account").type(newClient["bank-account"]);
    cy.get("#website").type(newClient["website"]);
    cy.get("#email").type(newClient["email"]);
    cy.get("#address").type(newClient["address"]);

    // Consultant asociat
    cy.contains(".MuiCardContent-root", "Consultant asociat")
      .find("#salesman")
      .parent()
      .click();
    cy.get("[role='presentation']")
      .contains(consultantUser["user-surname"])
      .click();

    cy.get('button[type="submit"]').contains("Creaza Client").click();
    cy.wait("@createClientHTTP", { timeout: 5000 });
    Generic.checkErrorModal();
  });

  it("Check newly create client", () => {
    Generic.clickOnMenuLeaf("Clienti");
    Generic.filterResult(newClient["company-name"]);
    Generic.checkFilteredResults(
      newClient["company-name"],
      newClient["cui"],
      consultantUser["user-surname"]
    );
  });

  it("Modify newly created client", () => {
    cy.intercept(
      "GET",
      "https://supa-met.moonlysoft.org/rest/v1/client?***"
    ).as("waitUpdateClientHTTP");

    Generic.clickOnMenuLeaf("Clienti");
    Generic.filterResult(newClient["company-name"]);

    cy.contains("tr", newClient["company-name"]).then((row) => {
      cy.wrap(row).find('button[aria-label="Edit"]').click({ force: true });
      cy.wait(2000);
      cy.get("#company-name", { timeout: 5000 })
        .clear()
        .type(newClient.updatedCompanyName);

      cy.get('button[type="submit"]').click();
      cy.wait("@waitUpdateClientHTTP", { timeout: 5000 });
      Generic.checkErrorModal();
    });
  });

  it("Check modified client", () => {
    Generic.clickOnMenuLeaf("Clienti");
    Generic.filterResult(newClient.updatedCompanyName);
    Generic.checkFilteredResults(
      newClient.updatedCompanyName,
      newClient["cui"],
      consultantUser["user-surname"]
    );
  });

  it.skip("Delete newly created client", () => {
    cy.intercept(
      "GET",
      "https://supa-met.moonlysoft.org/rest/v1/client?***"
    ).as("deleteClientHTTP");

    cy.get("a.MuiButtonBase-root h6").contains("Clienti").click();
    cy.get("#start-adornment-email").type(newClient.updatedCompanyName);
    cy.wait(2000);
    cy.contains("tr", newClient.updatedCompanyName).then((row) => {
      cy.wrap(row).find('[aria-label="Delete"]').click({ force: true });
      cy.get(".MuiDialogContent-root").contains("button", "Sterge").click();
      cy.wait("@deleteClientHTTP", { timeout: 10000 });
    });

    // verify table again'
    cy.get("a.MuiButtonBase-root h6").contains("Clienti").click();
    cy.get("#start-adornment-email").type(newClient.updatedCompanyName);
    cy.get(".MuiTableBody-root").then((tableBody) => {
      cy.wrap(tableBody).should("not.contain", newClient.updatedCompanyName);
      cy.wrap(tableBody).should("not.contain", newClient["cui"]);
      // cy.wrap(tableBody).should("not.contain", newClient["consultant"]);
    });
  });
});
