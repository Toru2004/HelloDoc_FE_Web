import type { IReportRepository } from '@/domain/repositories/report_repository';
import type { IHttpClient } from '@/data/datasources/http_client';
import type { PaginatedResponse } from '@/domain/entities/pagination';

export class ReportRepositoryImpl implements IReportRepository {
  constructor(private client: IHttpClient) {}

  async getAll(): Promise<Report[]> {
    return await this.client.get<Report[]>('/report');
  }

  async getAllFiltered(limit: number, offset: number, searchText: string): Promise<PaginatedResponse<Report>> {
    return await this.client.get<PaginatedResponse<Report>>(`/report/get-all-filtered?limit=${limit}&offset=${offset}&searchText=${searchText}`);
  }
}
