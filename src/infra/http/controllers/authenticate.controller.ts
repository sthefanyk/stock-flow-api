import {
    BadRequestException,
    Body,
    Controller,
    Post,
    UnauthorizedException,
    UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { AutheticateUserUseCase } from '@/domain/user-and-permission-management/application/use-cases/user/authenticate-user'
import { WrogCredentialsError } from '@/shared/errors/use-case-errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public'

const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('sessions')
@Public()
export class AuthenticateController {
    constructor(private authenticateUser: AutheticateUserUseCase) {}

    @Post()
    @UsePipes(
        new ZodValidationPipe<AuthenticateBodySchema>(authenticateBodySchema),
    )
    async handle(@Body() data: AuthenticateBodySchema) {
        const { email, password } = authenticateBodySchema.parse(data)

        const result = await this.authenticateUser.execute({
            email,
            password,
        })

        if (result.isLeft()) {
            const error = result.value

            switch (error.constructor) {
                case WrogCredentialsError:
                    throw new UnauthorizedException(error.message)
                default:
                    throw new BadRequestException(error.message)
            }
        }

        return {
            access_token: result.value.accessToken,
        }
    }
}
