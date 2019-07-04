// tslint:disable-next-line:max-line-length
const EMAILREGEXP = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/;
export const emailRule = (value: string) => {
  const regexp = new RegExp(EMAILREGEXP);
  return regexp.test(value);
};
export const requiredRule = (value: string) => !!value;
export const passwordEqualRule = (value: string, passwrodOriginal: string) =>
  value === passwrodOriginal;

export const allowToWithdrawRule = (value: number, selectedBill: number, totalBillAmount: number) => {
  if (!value || value <= 0) {
    return false;
  }
  if (!selectedBill) {
    return false;
  }
  if (value > totalBillAmount) {
    return false;
  }
  return true;
}

export const allowToSelectBillRule = (value: number, bankAllows:boolean) => value > 0 && bankAllows;
