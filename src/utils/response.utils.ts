import { IObject } from '@src/interface/common.interface';

export const getPaginatedData = (req, queryBuilder) => {
  const meta = req.body?.meta;
  const limit = parseInt(meta?.limit as string);
  if (limit && limit > 0) queryBuilder = queryBuilder.limit(limit).skip(((parseInt(meta?.page as string) || 1) - 1) * limit);
  return queryBuilder;
};

export const responseWithMeta = (res, data, totalRecords: number, reqMeta: IObject) => {
  const currentPage = parseInt(reqMeta?.page as string) || 1;
  const totalPages = Math.ceil(totalRecords / (parseInt(reqMeta?.limit as string) || 10));
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  return res.status(200).json({
    success: true,
    data,
    meta: {
      currentPageTotal: data?.length,
      totalRecords,
      totalPages,
      nextPage,
      prevPage,
      limit: reqMeta?.limit,
      page: currentPage,
    },
  });
};
