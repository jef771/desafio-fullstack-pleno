import { test, expect } from "@playwright/test";

test("successful login", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("E-mail").fill(
    "<email>"
  );

  await page.getByLabel("Senha").fill(
    "<password>"
  );

  await page.getByRole("button", {
    name: "ACESSAR",
  }).click();

  await expect(page).toHaveURL("/");
});


test("shows error for invalid credentials", async ({
  page,
}) => {
  await page.goto("/login");

  await page.getByLabel("E-mail").fill(
    "wrong@test.com"
  );

  await page.getByLabel("Senha").fill(
    "wrong-password"
  );

  await page.getByRole("button", {
    name: "ACESSAR",
  }).click();

  await expect(
    page.getByText(
      "Usuário ou senha inválidos"
    )
  ).toBeVisible();
});