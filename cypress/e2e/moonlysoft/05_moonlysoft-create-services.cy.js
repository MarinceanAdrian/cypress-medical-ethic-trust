import Generic from "../../support/page_objects/moonlysoft/generic";

/// <reference types="cypress" />

const newSupplier = {
  "company-name": "Company Test Furnizor Adi",
  updatedCompanyName: "Company Test Furnizor Adi Updated",
  cui: "123456789",
  "bank-account": "CTEST98765432198765432TT",
  website: "https://www.google.com/",
  "contact-email": "companytest_furnizor@test.com",
  address: "Test Adress Furnizor 1st",
  "contact-first-name": "Marincean",
  "contact-last-name": "Adrian",
  "contact-phone": "555-555-555",
};

const newServices = {
  name: "Test Service 22",
  description: "Test Service 22 Description",
  price: 100,
  pret: 5,
  cost: 200,
  updatedServiceName: "Test Service 22 Upd",
  updatedServiceDescription: "Test Service 22 Description Upd",
};

describe("Moonlysoft", () => {
  beforeEach(() => {
    cy.visit("https://met.moonlysoft.org/");

    cy.get("#email-login").type("admin@moonlysoft.com");
    cy.get("#-password-login").type("admin123");
    cy.get('button[type="submit"]').contains("Login").click();
  });

  // Servicii
  it("Add new Services", () => {
    cy.intercept(
      "POST",
      "https://supa-met.moonlysoft.org/rest/v1/service_template?***"
    ).as("waitHTTP");
    cy.intercept(
      "GET",
      "https://supa-met.moonlysoft.org/rest/v1/service_template?***"
    ).as("waitHTTPSave");
    Generic.clickOnAddRecordFor("Servicii");

    cy.get("#name").type(newServices.name);
    cy.get("#description").type(newServices.description);

    cy.contains("div", "TVA").find("#vat_rate").click();
    cy.get('[data-value="19"]').click();
    // inputul asta de pret trebuie verificat ca nu e ceva ok la el
    cy.get("#pret").clear().type(newServices.pret);
    cy.get("#cost").clear().type(newServices.cost);

    cy.get("#supplier_id").click();
    cy.get(".MuiList-root").contains(newSupplier["company-name"]).click();

    cy.get('button[type="submit"]').click();
    cy.wait("@waitHTTP", { timeout: 5000 });
    cy.get('button[type="button"]').contains("Salveaza").click();
    cy.wait("@waitHTTPSave", { timeout: 5000 });
  });

  it("Check newly service", () => {
    Generic.clickOnMenuLeaf("Servicii");
    Generic.filterResult(newServices.name);
    Generic.checkFilteredResults(newServices.name, newServices.description);
  });

  it("Modify newly created service", () => {
    cy.intercept(
      "PATCH",
      "https://supa-met.moonlysoft.org/rest/v1/service_template?***"
    ).as("waitHTTP");
    cy.intercept(
      "GET",
      "https://supa-met.moonlysoft.org/rest/v1/service_template?***"
    ).as("waitHTTPSave");

    Generic.clickOnMenuLeaf("Servicii");
    Generic.filterResult(newServices.name);

    cy.contains("tr", newServices.name).then((row) => {
      cy.wrap(row).click({ force: true });
      cy.wait(2000);
      cy.get("#name", { timeout: 5000 })
        .clear()
        .type(newServices.updatedServiceName);
      cy.get("#description", { timeout: 5000 })
        .clear()
        .type(newServices.updatedServiceDescription);

      cy.get('button[type="submit"]').click();
      cy.wait("@waitHTTP", { timeout: 5000 });
      cy.get('button[type="button"]').contains("Salveaza").click();
      cy.wait("@waitHTTPSave", { timeout: 5000 });

      // When updating a service there is no modal. Check with Nelu
      // Generic.checkErrorModal();
    });
  });

  it("Check updated service", () => {
    Generic.clickOnMenuLeaf("Servicii");
    Generic.filterResult(newServices.updatedServiceName);
    Generic.checkFilteredResults(
      newServices.updatedServiceName,
      newServices.updatedServiceDescription
    );
  });
});
