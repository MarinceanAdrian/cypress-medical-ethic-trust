/// <reference types="cypress" />

import Generic from "../../support/page_objects/moonlysoft/generic";
import { onLeadsPage } from "../../support/page_objects/moonlysoft/leadsPage";

const newLead = {
  "company-name": "Lead Test 33",
  alias: "LEADTEST",
  cui: "123456789",
  "bank-account": "CTEST98765432198765432TT",
  website: "https://www.google.com/",
  email: "companytest@test.com",
  address: "Test Lead Adress 1st",
  notes: "Note about the Test Lead 33",
};

const contact = {
  "contact-first-name": "Adrian Test",
  "contact-last-name": "Marincean Test",
  "contact-role": "QA Engineer",
  "contact-phone": "+40700000000",
  "contact-email": "adi@gmail.com",
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

  it("Create new Leads", () => {
    // cy.intercept("POST", "http://157.230.111.110/rest/v1/lead?***").as(
    //   "createLeadHTTP"
    // );
    Generic.clickOnAddRecordFor("Leads");

    onLeadsPage.selectFromDropdown("Status", "#menu-status", "Contact Initial");
    onLeadsPage.selectFromDropdown(
      "Consultant asociat",
      "#menu-salesman",
      consultantUser["user-surname"]
    );
    onLeadsPage.selectFromDropdown("Sursa", "#menu-source", "Baza de date");

    cy.get("#company-name").type(newLead["company-name"]);
    cy.get("#alias").type(newLead.alias);
    cy.get("#cui").type(newLead.cui);
    cy.get("#bank-account").type(newLead["bank-account"]);
    cy.get("#website").type(newLead.website);
    cy.get("#email").type(newLead.email);
    cy.get("#address").type(newLead.address);

    cy.get("#contact-first-name").type(contact["contact-first-name"]);
    cy.get("#contact-last-name").type(contact["contact-last-name"]);
    cy.get("#contact-role").type(contact["contact-role"]);
    cy.get("#contact-phone").type(contact["contact-phone"]);
    cy.get("#contact-email").type(contact["contact-email"]);

    cy.get('[aria-label="rdw-editor"]').type(newLead.notes);
    cy.get('button[type="submit"]').contains("Creaza Lead").click();

    // No modal here
    // Generic.checkErrorModal();
    // cy.wait("@createLeadHTTP", { timeout: 10000 });
  });

  it("Check newly create Lead", () => {
    Generic.clickOnMenuLeaf("Leads");
    Generic.filterResult(newLead["company-name"]);
    Generic.checkFilteredResults(
      newLead["company-name"],
      "Baza de date",
      "Contact Initial",
      consultantUser["user-surname"]
    );
  });

  it.skip("Delete newly created Lead", () => {
    cy.intercept("GET", "http://157.230.111.110/rest/v1/lead?***").as(
      "deleteLeadHTTP"
    );

    cy.get("a.MuiButtonBase-root h6").contains("Leads").click();
    cy.get("#start-adornment-email").type(newLead["company-name"]);
    cy.wait(2000);
    cy.contains("tr", newLead["company-name"]).then((row) => {
      cy.wrap(row).find('[aria-label="Sterge Lead"]').click({ force: true });
      cy.get(".MuiDialogContent-root").contains("button", "Sterge").click();
      cy.wait("@deleteLeadHTTP", { timeout: 10000 });
    });

    // verify table again'
    cy.get("a.MuiButtonBase-root h6").contains("Leads").click();
    cy.get("#start-adornment-email").type(newLead["company-name"]);
    cy.get(".MuiTableBody-root").then((tableBody) => {
      cy.wrap(tableBody).should("not.contain", newLead["company-name"]);
      cy.wrap(tableBody).should("not.contain", newLead["cui"]);
      cy.wrap(tableBody).should("not.contain", newLead["consultant"]);
    });
  });
});
