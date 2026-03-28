// src/services/languageService.js

// Example API endpoint: /api/language.php
export async function fetchTranslations(lang) {
  const response = await fetch(`/api/language.php?lang=${lang}`);
  if (!response.ok) throw new Error('Failed to fetch translations');
  return response.json();
}
