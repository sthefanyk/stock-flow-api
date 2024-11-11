import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    HttpCode,
    NotFoundException,
    Post
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe'
import { CreateUserUseCase } from '@/domain/user-and-permission-management/application/use-cases/user/create-user'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { ResourcesAlreadyExistError } from '@/shared/errors/use-case-errors/resources-already-exist-error'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

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
export class CreateNewAccessForEmployee {
    constructor(private createUser: CreateUserUseCase) {}

    @Post('/access')
    @HttpCode(201)
    async handle(
        @Body(new ZodValidationPipe(createNewAccessForEmployeeBodySchema))
        data: CreateNewAccessForEmployeeBodySchema,
        @CurrentUser() user: UserPayload,
    ) {
        const { name, email, password, role_name: role, status } = data

        const result = await this.createUser.execute({
            userWhoExecutedID: user.sub,
            name,
            email,
            password,
            role,
            status,
        })

        if (result.isLeft()) {
            const error = result.value

            switch (error.constructor) {
                case ResourceNotFoundError:
                    throw new NotFoundException(error.message)
                case ResourcesAlreadyExistError:
                    throw new ConflictException(error.message)
                default:
                    throw new BadRequestException(error.message)
            }
        }

        return result.value
    }
}
