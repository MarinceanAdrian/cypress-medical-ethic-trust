class NavigationPage {
  formLayoutsPage() {
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();
  }

  modalPage() {
    cy.get("[title='Modal & Overlays']").click();
    cy.get("[title='Tooltip']").click();
  }

  tablesPage() {
    cy.get("[title='Tables & Data']").click();
    cy.get("[title='Smart Table']").click();
  }
}

export const onNavigationPage = new NavigationPage();
