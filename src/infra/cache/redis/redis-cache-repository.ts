import { Injectable } from '@nestjs/common'
import { RedisService } from './redis.service'
import { CacheDAO } from '../cache-dao'

@Injectable()
export class RedisCacheRepository implements CacheDAO {
    constructor(private redis: RedisService) {}

    async set(key: string, value: string): Promise<void> {
        await this.redis.set(key, value, 'EX', 60 * 15)
    }

    get(key: string): Promise<string | null> {
        return this.redis.get(key)
    }

    async delete(key: string): Promise<void> {
        await this.redis.del(key)
    }
}
