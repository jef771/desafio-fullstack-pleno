import { test, expect } from "@playwright/test";

async function login(page: any) {
  await page.goto("/login");

  await page.getByLabel("E-mail").fill(
    "<email>"
  );

  await page.getByLabel("Senha").fill(
    "<password>"
  );

  await page.getByRole("button", {
    name: /acessar/i,
  }).click();

  await expect(page).toHaveURL("/");
}

test.describe("Child details", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);

    await page.goto("/children");

    const firstCard = page.locator(
      'a[href*="/children/"]'
    ).first();

    await firstCard.click();
  });

  test("shows child details", async ({
    page,
  }) => {
    await expect(
      page.locator("#child-name")
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "Dados Gerais",
      })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "Revisão do Caso",
      })
    ).toBeVisible();
  });

  test("shows general information", async ({
    page,
  }) => {
    const generalDataSection = page.getByRole("region", {
    name: /dados gerais/i,
    });

    await expect(
    generalDataSection.getByText("Bairro")
    ).toBeVisible();

    await expect(
    generalDataSection.getByText("Responsável")
    ).toBeVisible();

    await expect(
    generalDataSection.getByText("Data de nascimento")
    ).toBeVisible();
  });

  test("can go back to children list", async ({
    page,
  }) => {
    await page.getByRole("link", {
      name: /voltar para a lista de crianças/i,
    }).click();

    await expect(page).toHaveURL(
      /\/children/
    );
  });

  test("shows monitoring domains", async ({
    page,
  }) => {
    await expect(
    page.getByRole("heading", {
        name: "Saúde",
        exact: true,
    })
    ).toBeVisible();

    await expect(
    page.getByRole("heading", {
        name: "Educação",
        exact: true,
    })
    ).toBeVisible();

    await expect(
    page.getByRole("heading", {
        name: "Assistência Social",
        exact: true,
    })
    ).toBeVisible();
  });
});