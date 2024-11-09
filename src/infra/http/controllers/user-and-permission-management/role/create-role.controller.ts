import { CreateRoleUseCase } from '@/domain/user-and-permission-management/application/use-cases/role/create-role'
import { Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'

const createCreateRoleBodySchema = z.object({
    name: z.string(),
})

type CreateCreateRoleBodySchema = z.infer<typeof createCreateRoleBodySchema>

@Controller('role')
export class CreateRoleController {
    constructor(private usecase: CreateRoleUseCase) {}

    @Post()
    async handle(@Body() data: CreateCreateRoleBodySchema) {
        const { name } = createCreateRoleBodySchema.parse(data)

        return this.usecase.execute({
            name,
        })
    }
}
