exports.validEmail = (email) => {
  return email.includes("@");
};

exports.passwordConfirmed = (password, confirmPassword) => {
  return password === confirmPassword;
};
