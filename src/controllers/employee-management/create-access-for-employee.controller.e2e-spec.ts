import request from 'supertest'
import { AppModule } from '@/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaService } from '@/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { hash } from 'bcryptjs'

describe('Create access for employee (E2E)', () => {
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

    test('[POST] /employee-management/access', async () => {
        await prisma.role.create({
            data: {
                name: 'TEST',
                description: '',
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
            },
        })

        const accessToken = jwt.sign({ sub: user.id })

        const response = await request(app.getHttpServer())
            .post('/employee-management/access')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: 'John Doe 2',
                email: 'johndoe2@example.com',
                password: '12345678',
                roleName: 'TEST',
            })

        expect(response.statusCode).toBe(201)
        const userOnDatabase = await prisma.user.findFirst({
            where: {
                name: 'John Doe 2',
            },
        })
        expect(userOnDatabase).toBeTruthy()
    })
})
