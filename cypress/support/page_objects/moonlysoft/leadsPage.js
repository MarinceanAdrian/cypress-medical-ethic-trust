class Leads {
  selectFromDropdown(cardName, listName, valueToSelect) {
    cy.contains(".MuiCardContent-root", cardName)
      .find("input")
      .parent()
      .click();
    cy.get(`${listName} ul li`).then((list) => {
      cy.wrap(list).each((li) => {
        if (li[0].innerText.includes(valueToSelect)) {
          cy.wrap(li).click();
        }
      });
    });
  }
}

export const onLeadsPage = new Leads();
