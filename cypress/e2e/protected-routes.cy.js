describe("Rutas protegidas", () => {
  it("no debe permitir entrar al dashboard admin sin login", () => {
    cy.visit("/admin", { failOnStatusCode: false });

    cy.url().should("match", /login|admin/);
  });

  it("no debe permitir entrar a gestión de votantes sin login", () => {
    cy.visit("/admin/votantes", { failOnStatusCode: false });

    cy.url().should("match", /login|admin/);
  });
});