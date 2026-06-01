export type PaginationParams = {
  page: number;
  limit: number;
  offset: number;
};

export function parsePagination(query: {
  page?: string | number;
  limit?: string | number;
}): PaginationParams {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  return { page, limit, offset: (page - 1) * limit };
}

export function paginationMeta(
  total: number,
  params: PaginationParams
): {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
} {
  return {
    page: params.page,
    limit: params.limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / params.limit)),
  };
}
