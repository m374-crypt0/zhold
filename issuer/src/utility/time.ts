export function nowFromEpochInSeconds() {
  return Math.floor(Date.now() / 1000)
}

export function thirtyDaysLaterFromEpochInSeconds() {
  return Math.floor((Date.now() + new Date(0).setHours(30 * 24)) / 1000)
}
