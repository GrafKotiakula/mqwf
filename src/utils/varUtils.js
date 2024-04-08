export const isDefined = (variable) => variable !== null && variable !== undefined
export const getValueOrDefault = (variable, defaultValue) => variable ? variable : defaultValue
export const isNotEmptyString = (variable) => variable !== '' && typeof variable === 'string'