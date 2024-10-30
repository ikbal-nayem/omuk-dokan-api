import { IObject } from '@src/interface/common.interface';
import { isNull } from './check-validation';

export const removeObjectEmptyProperty = (obj: IObject, removeEmptyObj: boolean = false) => {
  let params: IObject = {};
  const removable = ['', 'null', 'undefined', null, undefined];
  Object.keys(obj).forEach((key: string) => {
    if (removeEmptyObj && obj[key] instanceof Object) {
      if (!isNull(obj[key])) params[key] = obj[key];
      else return;
    }
    if (!removable.includes(obj[key])) params[key] = obj[key];
  });
  return params;
};
