///
/// USERS
///

export const validateUsername = (username) => {
  if(/^\s*$/.test(username)) { // is blank
    return 'Cannot be blank'
  } else if (username.length > 50) {
    return 'no more than 50 characters'
  } else if(!/^[a-zA-Z0-9_\-.]*$/.test(username)) { // contains invalid characters (not matches)
    return 'Latin letters, digits, underscores, dashes, dots only'
  } else {
    return null
  }
}

export const validatePassword = (password) => {
  if(password.length < 5) { 
    return 'at least 5 characters'
  } else if (password.length > 50) {
    return 'no more than 50 characters'
  } else if (/^[^a-z]*$/.test(password)) {
    return 'must contain lowercased letters'
  } else if (/^[^A-Z]*$/.test(password)) {
    return 'must contain uppercased letters'
  } else if (/^[^0-9]*$/.test(password)) {
    return 'must contain digits'
  } else {
    return null
  }
}

export const validateRepeatPassword = (repeatPassword, password) => {
  if(password !== repeatPassword) {
    return 'Passwords are not equal'
  } else {
    return null
  }
}

export const validateReviewText = text => {
  if(text.length > 5000) {
    return 'no more than 5000 characters'
  } else {
    return null
  }
}
