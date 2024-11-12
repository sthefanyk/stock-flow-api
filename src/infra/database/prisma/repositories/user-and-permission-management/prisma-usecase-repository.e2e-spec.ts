import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { CacheModule } from '@/infra/cache/cache.module'
import { UseCaseFactory } from '@/test/factories/user-and-permission-management/make-usecase'
import { CacheDAO } from '@/infra/cache/cache-dao'
import { UseCaseDAO } from '@/domain/user-and-permission-management/application/DAO/usecase-dao'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Prisma UseCase Repository (E2E)', () => {
    let app: INestApplication
    let cacheRepository: CacheDAO
    let useCaseRepository: UseCaseDAO
    let useCaseFactory: UseCaseFactory

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule, CacheModule],
            providers: [UseCaseFactory],
        }).compile()

        app = moduleRef.createNestApplication()

        useCaseRepository = moduleRef.get(UseCaseDAO)
        cacheRepository = moduleRef.get(CacheDAO)
        useCaseFactory = moduleRef.get(UseCaseFactory)

        await app.init()
    })

    it('should cache use case by name', async () => {
        const usecase = await useCaseFactory.makePrismaUseCase()

        const result = await useCaseRepository.findByName(usecase.name)

        const cached = await cacheRepository.get(`usecase:${usecase.name}`)

        expect(cached).not.toBeNull()

        expect(JSON.parse(cached!)).toEqual(
            expect.objectContaining({
                name: result?.name,
            }),
        )
    })

    it('should return cached use case by name on subsequent calls', async () => {
        const usecase = await useCaseFactory.makePrismaUseCase()

        let cached = await cacheRepository.get(`usecase:${usecase.name}`)

        expect(cached).toBeNull()

        await useCaseRepository.findByName(usecase.name)

        cached = await cacheRepository.get(`usecase:${usecase.name}`)

        expect(cached).not.toBeNull()

        const result = await useCaseRepository.findByName(usecase.name)

        expect(JSON.parse(cached!)).toEqual(
            expect.objectContaining({
                name: result?.name,
            }),
        )
    })

    it('should reset use case by name cache when saving the use case', async () => {
        const usecase = await useCaseFactory.makePrismaUseCase()

        await cacheRepository.set(
            `usecase:${usecase.name}`,
            JSON.stringify({ empty: true }),
        )

        await useCaseRepository.save(usecase)

        const cached = await cacheRepository.get(`usecase:${usecase.name}`)
        expect(cached).toBeNull()
    })
})
