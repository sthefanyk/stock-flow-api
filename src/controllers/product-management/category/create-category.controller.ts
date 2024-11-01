import {
    ConflictException,
    Body,
    Controller,
    HttpCode,
    Post,
    UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

const createCategoryBodySchema = z.object({
    code: z.string(),
    name: z.string(),
    description: z.string().optional().default(''),
})
type CreateCategoryBodySchema = z.infer<typeof createCategoryBodySchema>
const bodyValidationPipe = new ZodValidationPipe(createCategoryBodySchema)

@Controller('/product-management/category')
@UseGuards(JwtAuthGuard)
export class CreateCategoryController {
    constructor(private prisma: PrismaService) {}

    @Post()
    @HttpCode(201)
    async handle(@Body(bodyValidationPipe) body: CreateCategoryBodySchema) {
        const { code, name, description } = createCategoryBodySchema.parse(body)

        const categoryWithSameCode = await this.prisma.category.findUnique({
            where: {
                code,
            },
        })

        if (categoryWithSameCode) {
            throw new ConflictException(
                'Category with same code already exists.',
            )
        }

        await this.prisma.category.create({
            data: {
                code,
                name,
                description: description ?? '',
            },
        })
    }
}
