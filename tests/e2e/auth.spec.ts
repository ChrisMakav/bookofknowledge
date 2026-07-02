import { test, expect } from '@playwright/test'

const EMAIL    = `test+${Date.now()}@bookofknowledge.com`
const PASSWORD = 'TestPassword123!'

test.describe('Authentification', () => {
  test('inscription avec un email invalide affiche une erreur', async ({ page }) => {
    await page.goto('/inscription')
    await page.fill('input[name="email"]', 'pas-un-email')
    await page.fill('input[name="password"]', PASSWORD)
    await page.fill('input[name="confirm_password"]', PASSWORD)
    await page.fill('input[name="full_name"]', 'Test User')
    await page.click('button[type="submit"]')
    await expect(page.locator('[role="alert"]')).toBeVisible()
  })

  test('connexion avec des identifiants incorrects affiche une erreur', async ({ page }) => {
    await page.goto('/connexion')
    await page.fill('input[name="email"]', 'inconnu@example.com')
    await page.fill('input[name="password"]', 'mauvais-mdp')
    await page.click('button[type="submit"]')
    await expect(page.locator('[role="alert"]')).toContainText('incorrect')
  })

  test('lien "Se connecter" redirige depuis la page inscription', async ({ page }) => {
    await page.goto('/inscription')
    await page.click('text=Se connecter')
    await expect(page).toHaveURL('/connexion')
  })

  test('lien "Mot de passe oublié" est présent sur la connexion', async ({ page }) => {
    await page.goto('/connexion')
    await expect(page.locator('a[href="/mot-de-passe-oublie"]')).toBeVisible()
  })
})
