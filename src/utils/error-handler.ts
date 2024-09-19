export const throwErrorResponse = (res, error) => {
  return res.status(500).json({ success: false, error: error });
};
