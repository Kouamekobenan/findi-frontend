export interface PaginatedResult<T> {
  data: T[];
  totalPage: number;
  total: number;
  page: number;
  limit: number;
}
