export function isNameValid(name) {
  const namePattern = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
  return namePattern.test(name);
}

export function isAddressDetailValid(address) {}
