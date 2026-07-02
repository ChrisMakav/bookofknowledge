import { test, expect } from '@playwright/test'

test.describe('Catalogue', () => {
  test('affiche la page catalogue avec le titre', async ({ page }) => {
    await page.goto('/catalogue')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('la recherche met à jour l\'URL', async ({ page }) => {
    await page.goto('/catalogue')
    const search = page.locator('input[type="search"], input[placeholder*="Rechercher"]').first()
    await search.fill('roman')
    await search.press('Enter')
    await expect(page).toHaveURL(/q=roman/)
  })

  test('le FAB scanner est visible', async ({ page }) => {
    await page.goto('/catalogue')
    await expect(page.locator('button[aria-label="Scanner un ISBN"]')).toBeVisible()
  })

  test('le scanner s\'ouvre et se ferme', async ({ page }) => {
    await page.goto('/catalogue')
    await page.click('button[aria-label="Scanner un ISBN"]')
    await expect(page.locator('text=Scanner un ISBN')).toBeVisible()
    await page.click('button[aria-label="Fermer"], button:has(svg[data-lucide="x"])')
    await expect(page.locator('text=Scanner un ISBN')).not.toBeVisible()
  })
})
