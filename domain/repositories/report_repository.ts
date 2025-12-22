import type { PaginatedResponse } from '../entities/pagination';

export interface IReportRepository {
  getAll(): Promise<Report[]>;
  getAllFiltered(limit: number, offset: number, searchText: string): Promise<PaginatedResponse<Report>>;
}
