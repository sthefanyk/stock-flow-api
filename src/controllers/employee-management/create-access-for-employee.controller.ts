import {
    Body,
    ConflictException,
    Controller,
    HttpCode,
    NotFoundException,
    Post,
    UseGuards,
    UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const createNewAccessForEmployeeBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    roleName: z.string().toUpperCase(),
})

type CreateNewAccessForEmployeeBodySchema = z.infer<
    typeof createNewAccessForEmployeeBodySchema
>

@Controller('employee-management/access')
@UseGuards(JwtAuthGuard)
export class CreateNewAccessForEmployee {
    constructor(private prisma: PrismaService) {}

    @Post()
    @HttpCode(201)
    @UsePipes(
        new ZodValidationPipe<CreateNewAccessForEmployeeBodySchema>(
            createNewAccessForEmployeeBodySchema,
        ),
    )
    async handle(@Body() data: CreateNewAccessForEmployeeBodySchema) {
        const { name, email, password, roleName } =
            createNewAccessForEmployeeBodySchema.parse(data)

        const userWithSameEmail = await this.prisma.user.findUnique({
            where: {
                email,
            },
        })

        if (userWithSameEmail) {
            throw new ConflictException(
                'Access with same e-mail already exists.',
            )
        }

        const role = await this.prisma.role.findUnique({
            where: {
                name: roleName,
            },
        })

        if (!role) {
            throw new NotFoundException('Role not found.')
        }

        const passwordHash = await hash(password, 8)

        await this.prisma.user.create({
            data: {
                name,
                email,
                password_hash: passwordHash,
                role: {
                    connect: {
                        name: roleName,
                    },
                },
            },
        })
    }
}
