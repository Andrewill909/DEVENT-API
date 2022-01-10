export const toBase64 = (obj: Object) => {
  const str = JSON.stringify(obj);
  return Buffer.from(str).toString('base64');
};

export const toUTF8 = (ent: Buffer | string) => {
  return Buffer.from(ent).toString('utf-8');
};
