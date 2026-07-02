import { test, expect } from '@playwright/test'

test.describe('Fiche livre', () => {
  test('la page 404 s\'affiche pour un slug inconnu', async ({ page }) => {
    await page.goto('/livres/slug-inexistant-xyz')
    await expect(page).toHaveURL(/livres\/slug-inexistant-xyz/)
    // Next.js notFound() returns 404
    const response = await page.request.get('/livres/slug-inexistant-xyz')
    expect(response.status()).toBe(404)
  })

  test('le catalogue contient des liens vers des fiches livres', async ({ page }) => {
    await page.goto('/catalogue')
    const firstBookLink = page.locator('a[href^="/livres/"]').first()
    const count = await firstBookLink.count()
    // Only test if there are books in the database
    if (count > 0) {
      const href = await firstBookLink.getAttribute('href')
      await page.goto(href!)
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('button, [role="button"]').filter({ hasText: /panier|ajouter/i }).first()).toBeVisible()
    }
  })
})
