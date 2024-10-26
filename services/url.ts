export const validateUrl = (url: string | null | undefined): string | null => {
  if (url === null || url === undefined || !url.trim()) {
    return 'Не указан URL'
  }

  try {
    const urlObject = new URL(url);

    if (!['http:', 'https:'].includes(urlObject.protocol)) {
      return 'ULR должен начинаться на http:// или https://'
    }

    if (!urlObject.hostname) {
      return 'Неправильный домен'
    }
    return null
  } catch (error) {
    return 'Неправильный формат'
  }
};
