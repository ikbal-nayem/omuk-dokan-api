import { IObject } from '@src/interface/common.interface';
import { Request } from 'express';
import { isNull } from './check-validation';

export const getRequestBody = (req: Request) => {
  if (isNull(req.body) || isNull(req.body?.data)) {
    return null;
  }
  try {
    return JSON.parse(req.body?.data);
  } catch (error) {
    return req.body;
  }
};

export const generateSearchQuery = (req: Request) => {  
  // In case of searchKey and any others custom filter props it should handle it on controller level as searchKey fields are dynamic
  const qFileds: IObject = req.body?.filter;
  const query: any = { isDeleted: false };  
  Object.keys(qFileds || {}).map((qKey) => {
    if (qKey !== 'searchKey' && !isNull(qFileds[qKey])) {
      query[qKey] = qFileds[qKey];
    }
  });
  return query;
};
