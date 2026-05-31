describe("Página de inicio", () => {
  it("debe cargar correctamente", () => {
    cy.visit("/");
    cy.contains(/votar|voto|nexa|inicio/i).should("be.visible");
  });
});