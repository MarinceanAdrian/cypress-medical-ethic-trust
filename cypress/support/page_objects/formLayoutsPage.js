export class FormLayoutsPage {
  submitInlineFormWithNameAndEmail(name, email) {
    cy.get("form")
      .first()
      .then((form) => {
        cy.wrap(form).find("input").first().type(name);
        cy.wrap(form).find("input").eq(1).type(email);
        cy.wrap(form).submit();
      });
  }
}

export const onFormLayousPage = new FormLayoutsPage();
