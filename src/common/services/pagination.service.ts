import { Injectable } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class PaginationService {
  async paginate<T extends ObjectLiteral>(
    repository: Repository<T>,
    page: number = 1,
    limit: number = 10,
    options: any = {},
  ) {
    const [data, total] = await repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      ...options,
    });

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }
}
