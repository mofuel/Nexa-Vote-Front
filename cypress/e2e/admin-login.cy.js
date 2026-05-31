describe("Login Admin", () => {
  it("debe mostrar el formulario de login admin", () => {
    cy.visit("/loginadmin");

    cy.get("body").should("be.visible");
    cy.get("input").should("exist");
    cy.get("button").should("exist");
  });

  it("no debe entrar con credenciales falsas", () => {
    cy.visit("/loginadmin");

    cy.get("input").first().type("fake@test.com");
    cy.get("input").eq(1).type("123456");
    cy.get("button").first().click();

    cy.url().should("include", "/loginadmin");
  });
});