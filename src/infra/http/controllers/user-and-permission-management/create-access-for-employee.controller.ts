import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
    Body,
    Controller,
    HttpCode,
    Post,
    UseGuards,
    UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe'
import { CreateUserUseCase } from '@/domain/user-and-permission-management/application/use-cases/user/create-user'

const createNewAccessForEmployeeBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    role_name: z.string().toUpperCase(),
    status: z.string().toUpperCase(),
})

type CreateNewAccessForEmployeeBodySchema = z.infer<
    typeof createNewAccessForEmployeeBodySchema
>

@Controller('/employee-management')
@UseGuards(JwtAuthGuard)
export class CreateNewAccessForEmployee {
    constructor(private createUser: CreateUserUseCase) {}

    @Post('/access')
    @HttpCode(201)
    @UsePipes(
        new ZodValidationPipe<CreateNewAccessForEmployeeBodySchema>(
            createNewAccessForEmployeeBodySchema,
        ),
    )
    async handle(@Body() data: CreateNewAccessForEmployeeBodySchema) {
        const {
            name,
            email,
            password,
            role_name: role,
            status,
        } = createNewAccessForEmployeeBodySchema.parse(data)

        const result = await this.createUser.execute({
            userWhoExecutedID: '',
            name,
            email,
            password,
            role,
            status,
        })

        return result.value
    }
}
