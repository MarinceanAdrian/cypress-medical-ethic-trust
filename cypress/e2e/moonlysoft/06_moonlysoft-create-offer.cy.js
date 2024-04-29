/// <reference types="cypress" />

import Generic from "../../support/page_objects/moonlysoft/generic";

const newOffer = {
  name: "Test Oferte Adi 1",
};

const client = {
  updatedCompanyName: "Company Test SRL UPDATED",
};

const service = {
  updatedServiceName: "Test Service 22 Upd",
  updatedServiceDescription: "Test Service 22 Description Upd",
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

  it("Create new Offer", () => {
    cy.intercept("GET", "https://supa-met.moonlysoft.org/rest/v1/offer?***").as(
      "createOfferHTTP"
    );
    cy.intercept(
      "POST",
      "https://supa-met.moonlysoft.org/rest/v1/offer?***"
    ).as("checkOfferHTTP");
    cy.intercept(
      "GET",
      "https://supa-met.moonlysoft.org/rest/v1/client?***"
    ).as("waitForClientSelectHTTP");

    Generic.clickOnAddRecordFor("Oferte");

    cy.get("#name", { timeout: 20000 }).type(newOffer.name);

    // Select Consultant. For now is a hardcoded one until
    // the user create flow is functional
    cy.get("#sales_id").click();
    cy.get('[role="presentation"]')
      .contains(consultantUser["user-surname"])
      .click();

    // Select Beneficiar
    cy.contains(".MuiCardContent-root", "Beneficiar").then(
      (beneficiarContainer) => {
        cy.wrap(beneficiarContainer).find("button").click();
      }
    );

    cy.contains("div", "Selecteaza Clientul")
      .parent()
      .parent()
      .then((dialog) => {
        cy.wrap(dialog).contains(client.updatedCompanyName).click();
        cy.wrap(dialog).contains("Adauga").click();
        cy.wait("@waitForClientSelectHTTP", { timeout: 5000 });
      });

    cy.contains(".MuiCardContent-root", "Beneficiar").then(
      (beneficiarContainer) => {
        cy.wrap(beneficiarContainer).should(
          "contain",
          client.updatedCompanyName
        );
      }
    );

    // The last Adauga button from the page
    cy.get("button[type='button']")
      .find(".MuiButton-startIcon.MuiButton-iconSizeMedium")
      .parent()
      .click();

    cy.contains("div", "Selecteaza un serviciu/abonament")
      .parent()
      .parent()
      .then((dialog) => {
        cy.wrap(dialog).contains(service.updatedServiceName).click();
        cy.wrap(dialog).contains("Adauga").click();
      });

    cy.get(".MuiTable-root").should("contain", service.updatedServiceName);
    // // Aici in plus verifica calculele

    cy.get('button[type="submit"]').contains("Creaza").click();
    cy.wait("@createOfferHTTP", { timeout: 5000 });

    // This is a http check because in the GUI the modal for the success
    // creation appeared, but the request was bad and the object
    // was not created although in the GUI everything seemd ok.
    // cy.wait("@checkOfferHTTP", { timeout: 5000 }).then((req) => {
    //   expect(req.response.statusCode).to.not.equal(400);
    // });
    Generic.checkErrorModal();
  });

  it("Check newly offer", () => {
    Generic.clickOnMenuLeaf("Oferte");
    Generic.filterResult(newOffer.name);
    Generic.checkFilteredResults(newOffer.name, "CAM Manager");
  });
});
