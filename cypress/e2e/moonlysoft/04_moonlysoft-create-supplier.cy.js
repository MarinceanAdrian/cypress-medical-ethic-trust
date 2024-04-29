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

describe("Moonlysoft", () => {
  beforeEach(() => {
    cy.visit("https://met.moonlysoft.org/");

    cy.get("#email-login").type("admin@moonlysoft.com");
    cy.get("#-password-login").type("admin123");
    cy.get('button[type="submit"]').contains("Login").click();
  });

  it("Add new Supliers (Furnizori) from Configurari", () => {
    cy.intercept(
      "POST",
      "https://supa-met.moonlysoft.org/rest/v1/sys_supplier?***"
    ).as("waitForSupplierCreate");

    Generic.clickOnAddRecordFor("Configurari");

    cy.get('[name="comp_name"]').type(newSupplier["company-name"]);
    cy.get("#comp_identifier").type(newSupplier.cui);
    cy.get("#website").type(newSupplier.website);
    cy.get("#comp_address").type(newSupplier.address);

    cy.get("#contact-first-name").type(newSupplier["contact-first-name"]);
    cy.get("#contact-last-name").type(newSupplier["contact-last-name"]);
    cy.get("#contact-phone").type(newSupplier["contact-phone"]);
    cy.get("#contact-email").type(newSupplier["contact-email"]);

    Generic.clickOnAddButtonAndCheckModal();
    cy.wait("@waitForSupplierCreate", { timeout: 5000 });
  });

  it("Check newly created supplier (furnizor)", () => {
    Generic.clickOnMenuLeaf("Configurari");
    Generic.filterResult(newSupplier["company-name"]);
    Generic.checkFilteredResults(
      newSupplier["company-name"],
      newSupplier["cui"],
      newSupplier["contact-first-name"]
    );
  });

  it("Modify newly created supplier", () => {
    cy.intercept(
      "GET",
      "https://supa-met.moonlysoft.org/rest/v1/sys_supplier?***"
    ).as("waitUpdateHTTP");

    Generic.clickOnMenuLeaf("Configurari");
    Generic.filterResult(newSupplier["company-name"]);

    cy.contains("tr", newSupplier["company-name"]).then((row) => {
      cy.wrap(row).find('button[aria-label="Edit"]').click({ force: true });
      cy.wait(2000);
      cy.get("[name='comp_name']", { timeout: 5000 }).clear();
      cy.get("[name='comp_name']", { timeout: 5000 }).type(
        newSupplier.updatedCompanyName
      );

      cy.contains("form", "Modifica furnizor")
        .find("button")
        .contains("Actualizeaza")
        .click();

      cy.wait("@waitUpdateHTTP", { timeout: 5000 });
      Generic.checkErrorModal();
    });
  });

  it("Check modified supplier", () => {
    Generic.clickOnMenuLeaf("Configurari");
    Generic.filterResult(newSupplier.updatedCompanyName);

    Generic.checkFilteredResults(
      newSupplier.updatedCompanyName,
      newSupplier.cui,
      newSupplier["contact-first-name"]
    );
  });

  it.skip("Delete newly created supplier", () => {
    cy.intercept(
      "GET",
      "https://supa-met.moonlysoft.org/rest/v1/sys_supplier?***"
    ).as("deleteHTTP");

    Generic.clickOnMenuLeaf("Configurari");
    Generic.filterResult(newSupplier.updatedCompanyName);
    Generic.deleteObject(newSupplier.updatedCompanyName);

    // verify table again'
    Generic.clickOnMenuLeaf("Configurari");
    Generic.filterResult(newSupplier.updatedCompanyName);
    Generic.checkResultsAreNotPresent(
      newSupplier.updatedCompanyName,
      newSupplier.cui,
      newSupplier["contact-first-name"]
    );
  });
});
