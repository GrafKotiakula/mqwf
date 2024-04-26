export const isNotEmptyString = variable => variable !== '' && typeof variable === 'string'
export const isNotEmptyObject = variable => variable?.constructor === Object && Object.keys(variable).length !== 0
export const isNotEmptyArray = variable => variable?.constructor === Array && variable.length !== 0

export const pageNumberIsOk = page => page > 0 && page !== Infinity && page !== NaN
export const aspectRatioIsOk = (width, height, aspectRatio, eps=1e-5) => Math.abs(width/height - aspectRatio) < eps