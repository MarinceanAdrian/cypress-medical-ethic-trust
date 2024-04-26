/// <reference types="cypress" />

let menuTreeLabels = [];

const newLead = {
  "company-name": "Lead Test 33",
  alias: "LEADTEST",
  cui: "123456789",
  "bank-account": "CTEST98765432198765432TT",
  website: "https://www.google.com/",
  email: "companytest@test.com",
  address: "Test Lead Adress 1st",
  consultant: "Ioan Solovastru",
};

const contact = {
  "contact-first-name": "Adrian Test",
  "contact-last-name": "Marincean Test",
  "contact-role": "QA Engineer",
  "contact-phone": "+40700000000",
  "contact-email": "adi@gmail.com",
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

  it("Create new Leads", () => {
    cy.intercept("POST", "http://157.230.111.110/rest/v1/lead?***").as(
      "createLeadHTTP"
    );

    cy.get("a.MuiButtonBase-root h6").contains("Leads").click();
    cy.get('button[type="button"]').contains("Adauga").click();

    cy.contains(".MuiCardContent-root", "Consultant asociat")
      .find('input[name="salesman"]')
      .parent()
      .click();

    cy.get("#menu-salesman ul li").then((list) => {
      cy.wrap(list).each((li) => {
        if (li[0].innerText === newLead.consultant) {
          cy.wrap(li).click();
        }
      });

      cy.contains(".MuiCardContent-root", "Sursa")
        .find('input[name="source"]')
        .parent()
        .click();

      cy.get("#menu-source ul li").then((list) => {
        cy.wrap(list).each((li) => {
          if (li[0].innerText === "Recomandare") {
            cy.wrap(li).click();
          }
        });
      });

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
    });

    cy.get('[aria-label="rdw-editor"]').type("Note about the Test Lead 33");
    cy.get('button[type="submit"]').contains("Creaza Lead").click();
    cy.wait("@createLeadHTTP", { timeout: 10000 });
  });

  it("Check newly create Lead", () => {
    cy.get("a.MuiButtonBase-root h6").contains("Leads").click();
    cy.get("#start-adornment-email").type(newLead["company-name"]);
    cy.wait(2000);
    cy.get(".MuiTableBody-root").then((tableBody) => {
      cy.wrap(tableBody).should("contain", newLead["company-name"]);
      cy.wrap(tableBody).should("contain", "Recomandare");
      cy.wrap(tableBody).should("contain", newLead["consultant"]);
    });
  });

  it("Delete newly created Lead", () => {
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
