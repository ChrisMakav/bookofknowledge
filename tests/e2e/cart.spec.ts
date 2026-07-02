import { test, expect } from '@playwright/test'

test.describe('Panier', () => {
  test('le drawer panier s\'ouvre depuis la navbar', async ({ page }) => {
    await page.goto('/')
    // Click cart icon in navbar
    await page.locator('button[aria-label*="panier"], button[aria-label*="Panier"]').first().click()
    await expect(page.locator('[role="dialog"], aside').filter({ hasText: /panier/i }).first()).toBeVisible()
  })

  test('le panier est vide par défaut', async ({ page }) => {
    // Clear localStorage first
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('bok-cart'))
    await page.reload()
    await page.locator('button[aria-label*="panier"], button[aria-label*="Panier"]').first().click()
    await expect(page.locator('text=/vide|0 article/i').first()).toBeVisible()
  })

  test('la page d\'accueil se charge correctement', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })

  test('les pages de navigation principale sont accessibles', async ({ page }) => {
    for (const path of ['/', '/catalogue', '/connexion', '/inscription']) {
      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
    }
  })
})
