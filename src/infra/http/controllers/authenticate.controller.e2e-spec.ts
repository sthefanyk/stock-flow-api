import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Authenticate (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleRef.createNestApplication()

        prisma = moduleRef.get(PrismaService)
        await app.init()
    })

    test('[POST] /sessions', async () => {
        await prisma.role.create({
            data: {
                name: 'TEST',
            },
        })

        const passwordHash = await hash('12345678', 8)

        await prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'johndoe@example.com',
                password_hash: passwordHash,
                role: {
                    connect: {
                        name: 'TEST',
                    },
                },
                status: '',
            },
        })

        const response = await request(app.getHttpServer())
            .post('/sessions')
            .send({
                email: 'johndoe@example.com',
                password: '12345678',
            })

        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual({
            access_token: expect.any(String),
        })
    })
})
