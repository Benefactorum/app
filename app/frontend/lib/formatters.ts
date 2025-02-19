export function formatAmount (amount: number): string {
  const formatter = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })

  if (amount >= 1000000) {
    // For 1M€ or more, show as X,XX M€
    return formatter.format(amount / 1000000) + ' M€'
  } else {
    // For less than 1M€, show as XX XXX €
    return formatter.format(amount) + ' €'
  }
}
