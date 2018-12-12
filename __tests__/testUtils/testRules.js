const EMAILREGEXP = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/;
export const emailRule = value => {
  const regexp = new RegExp(EMAILREGEXP);
  return regexp.test(value);
};
export const requiredRule = value => !!value;
export const passwordEqualRule = (value, passwrodOriginal) =>
  value === passwrodOriginal;

export const allowToWithdrawRule = (value, selectedBill, currentAmount) =>
  value && selectedBill && value < currentAmount;

export const allowToSelectBillRule = (value, bankAllows) => value && bankAllows;
