import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { hash } from 'bcryptjs'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AppModule } from '@/infra/app.module'
import { waitFor } from '@/test/utils/wait-for'

describe('On new action log (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleRef.createNestApplication()

        prisma = moduleRef.get(PrismaService)
        jwt = moduleRef.get(JwtService)

        await app.init()
    })

    it('should register new action log when user is created', async () => {
        await prisma.useCase.create({
            data: {
                name: 'create-user',
            },
        })

        await prisma.role.create({
            data: {
                name: 'TEST',
            },
        })

        const passwordHash = await hash('12345678', 8)

        const user = await prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'johndoe@example.com',
                password_hash: passwordHash,
                role: {
                    connect: {
                        name: 'TEST',
                    },
                },
                status: 'active',
            },
        })

        const accessToken = jwt.sign({ sub: user.id })

        await request(app.getHttpServer())
            .post('/employee-management/access')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: 'John Doe 2',
                email: 'johndoe2@example.com',
                password: '12345678',
                role_name: 'TEST',
                status: 'ACTIVE',
            })

        await waitFor(async () => {
            const userOnDatabase = await prisma.actionLog.findFirst({
                where: {
                    user_who_executed_id: user.id,
                },
            })
            expect(userOnDatabase).not.toBeNull()
        })
    })
})
