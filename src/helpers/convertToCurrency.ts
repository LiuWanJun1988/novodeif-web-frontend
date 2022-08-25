const cryptoNovo = Intl.NumberFormat('en-US')

const usdLocale = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumSignificantDigits: undefined,
})

export const convertToNovo = (value: number): string => {
  return cryptoNovo.format(Math.trunc(value))
}

export const convertToUSD = (
  value: number,
  minimumFractionDigits?: number
): string => {
  if (minimumFractionDigits != null) {
    return Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: minimumFractionDigits,
    }).format(value)
  }

  return usdLocale.format(value)
}

export const convertBnbToUSD = async (value: number) => {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd'
  )
  const data = await response.json()
  // check for error response
  if (!response.ok) {
    // get error message from body or default to response statusText
    const error = (data && data.message) || response.statusText
    return Promise.reject(error)
  }

  return data.binancecoin.usd * value
}
