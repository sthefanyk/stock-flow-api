import {
    ConflictException,
    Body,
    Controller,
    HttpCode,
    Post,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/product-management/category')
export class CreateCategoryController {
    constructor(private prisma: PrismaService) {}

    @Post()
    @HttpCode(201)
    async handle(@Body() body: any) {
        const { code, name, description } = body

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
