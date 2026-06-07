import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel(/e-mail/i).fill(
    "<email>"
  );

  await page.getByLabel(/senha/i).fill(
    "<password>"
  );

  await page.getByRole("button", {
    name: /acessar/i,
  }).click();

  await expect(page).toHaveURL("/");
});

test("loads children page", async ({
  page,
}) => {
  await page.goto("/children");

  await expect(
    page.getByRole("heading", {
      name: /crianças monitoradas/i,
    })
  ).toBeVisible();
});

test("shows children cards", async ({
  page,
}) => {
  await page.goto("/children");

  const cards = page.getByRole("link");

  await expect(cards.first()).toBeVisible();
});

test("filters by bairro", async ({
  page,
}) => {
  await page.goto("/children");

  await page
    .getByLabel(/Filtrar por bairro/i)
    .fill("Centro");

  await page.getByRole("button", {
    name: /aplicar filtros/i,
  }).click();

  await expect(page).toHaveURL(
    /bairro=Centro/
  );
});

test("opens child details", async ({
  page,
}) => {
  await page.goto("/children");

  await page.waitForLoadState("networkidle");

  const cards = page.getByLabel(
    /Abrir detalhes de/
  );

  await expect(cards.first()).toBeVisible();

  await cards.first().click();

  await expect(page).toHaveURL(
    /\/children\/[^/?]+/
  );

  await expect(
    page.locator("#child-name")
  ).toContainText(/\w+/);
});

test("shows empty state when no results", async ({
  page,
}) => {
  await page.goto(
    "/children?bairro=BAIRRO_INEXISTENTE_123"
  );

  await expect(
    page.getByText(
      /nenhuma criança encontrada/i
    )
  ).toBeVisible();
});

test("changes page", async ({
  page,
}) => {
  await page.goto("/children");

  const nextButton = page.getByRole(
    "link",
    {
      name: /próxima/i,
    }
  );

  if (await nextButton.isVisible()) {
    await nextButton.click();

    await expect(page).toHaveURL(
      /page=2/
    );
  }
});