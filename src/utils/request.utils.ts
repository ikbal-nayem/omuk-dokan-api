import { isNull } from "./check-validation";

export const getRequestBody = (req) => {
  if (isNull(req.body) || isNull(req.body?.data)) {
    return null;
  }
  try {
    return JSON.parse(req.body?.data);
  } catch (error) {
    return req.body;
  }
};
