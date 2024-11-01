import {
    Body,
    Controller,
    Post,
    UnauthorizedException,
    UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('sessions')
export class AuthenticateController {
    constructor(
        private jwt: JwtService,
        private prisma: PrismaService,
    ) {}

    @Post()
    @UsePipes(
        new ZodValidationPipe<AuthenticateBodySchema>(authenticateBodySchema),
    )
    async handle(@Body() data: AuthenticateBodySchema) {
        const { email, password } = authenticateBodySchema.parse(data)

        const user = await this.prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            throw new UnauthorizedException('User credentials do not match.')
        }

        const isPasswordValid = await compare(password, user.password_hash)

        if (!isPasswordValid) {
            throw new UnauthorizedException('User credentials do not match.')
        }

        const accessToken = this.jwt.sign({
            sub: user.id,
        })

        return {
            access_token: accessToken,
        }
    }
}
