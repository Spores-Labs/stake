export const shorten = (address = '', before = 6, after = 6) => {
  if (address.length < 10) return address;
  return address.slice(0, before) + '...' + address.slice(address.length - after);
};

export const getBase64 = (file, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(file);
};

export const earlyRewardAPR = 25;

export const maturityRewardAPR = 50;
