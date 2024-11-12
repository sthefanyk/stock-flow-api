import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { RedisService } from './redis/redis.service'
import { CacheDAO } from './cache-dao'
import { RedisCacheRepository } from './redis/redis-cache-repository'

@Module({
    imports: [EnvModule],
    providers: [
        RedisService,
        {
            provide: CacheDAO,
            useClass: RedisCacheRepository,
        },
    ],
    exports: [CacheDAO],
})
export class CacheModule {}
