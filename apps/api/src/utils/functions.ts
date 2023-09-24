export const getNodeEnv: () => 'development' | 'test' | 'production' = () => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    return process.env.NODE_ENV
  }
  return 'production'
}

export const objValueToString = (obj: Record<string, unknown>) => {
  return Object.entries(obj)
    .map(([key, value]) => [key, String(value)])
    .reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {} as Record<string, string>)
}
