import { CreateUseCaseUseCase } from '@/domain/user-and-permission-management/application/use-cases/usecase/create-usecase'
import { Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'

const createCreateUseCaseBodySchema = z.object({
    name: z.string(),
    description: z.string().optional(),
})

type CreateCreateUseCaseBodySchema = z.infer<
    typeof createCreateUseCaseBodySchema
>

@Controller('usecase')
export class CreateUseCaseController {
    constructor(private usecase: CreateUseCaseUseCase) {}

    @Post()
    async handle(@Body() data: CreateCreateUseCaseBodySchema) {
        const { name, description } = createCreateUseCaseBodySchema.parse(data)

        return this.usecase.execute({
            name,
            description,
        })
    }
}
