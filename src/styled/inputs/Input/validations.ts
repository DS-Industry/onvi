const validateEmail = (val: string) => {
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (reg.test(val) === true) {
    return true;
  }

  return false;
};

const validatePhone = (val: string) => {
  const reg = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;

  if (reg.test(val) === true) {
    return true;
  }

  return false;
};

export {validateEmail, validatePhone};
