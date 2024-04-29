export default class Generic {
  static timeout = 15000;

  static tooltipErrorClass = "MuiAlert-filledError";
  static clickOnMenuLeaf(menuLeafName) {
    cy.get("a.MuiButtonBase-root h6").contains(menuLeafName).click();
  }
  // Clicks on Adauga button to prepare the form
  static clickOnAddRecordFor(menuLeafName) {
    cy.get("a.MuiButtonBase-root h6", { timeout: this.timeout })
      .contains(menuLeafName)
      .click();
    cy.get('button[type="button"]', { timeout: this.timeout })
      .contains("Adauga")
      .click();
  }

  static filterResult(filterText) {
    cy.get("#start-adornment-email").type(filterText);
    cy.wait(2000);
  }

  static checkFilteredResults(...args) {
    args.forEach((checkData) =>
      cy.get(".MuiTableBody-root").should("contain", checkData)
    );
  }

  static checkResultsAreNotPresent(...args) {
    args.forEach((checkData) =>
      cy.get(".MuiTableBody-root").should("not.contain", checkData)
    );
  }

  static clickOnAddButtonAndCheckModal() {
    cy.get("button[type=submit]").contains("Adauga").click();
    cy.get('[role="presentation"]')
      .should("exist")
      .and("not.have.class", this.tooltipErrorClass);
  }

  static checkErrorModal() {
    cy.get(".MuiAlert-root", { timeout: 15000 })
      .should("exist")
      .and("not.include.class", this.tooltipErrorClass);
  }

  static deleteObject(objectToDelete) {
    cy.contains("tr", objectToDelete).then((row) => {
      cy.wrap(row).find('[aria-label="Delete"]').click({ force: true });
      cy.get(".MuiDialogContent-root").contains("button", "Sterge").click();
      cy.wait("@deleteHTTP", { timeout: this.timeout });
    });
  }
}
