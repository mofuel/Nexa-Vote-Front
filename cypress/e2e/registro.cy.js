describe("Registro de votante", () => {
  it("debe cargar la pantalla de registro", () => {
    cy.visit("/registro");

    cy.contains(/registro|dni|identidad/i).should("be.visible");
  });

  it("debe validar campos vacíos", () => {
    cy.visit("/registro");

    cy.get("button").first().click();

    cy.contains(/requerido|obligatorio|dni|error/i).should("exist");
  });
});