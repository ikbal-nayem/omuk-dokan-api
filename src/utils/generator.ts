import { isNull } from './check-validation';

export const makeSlug = (str: string) => {
  if (isNull(str)) return;
  str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
  str = str.toLowerCase(); // convert string to lowercase
  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
  return str;
};

export const getRequestBody = (req) => {
  if (isNull(req.body) || isNull(req.body?.data)) {
    return null;
  }
  try {
    return JSON.parse(req.body)?.data;
  } catch (error) {
    return req.body;
  }
};
