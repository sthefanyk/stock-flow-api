import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { AutheticateUserUseCase } from '@/domain/user-and-permission-management/application/use-cases/user/authenticate-user'

const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('sessions')
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
            return result.value
        }

        return {
            access_token: result.value.accessToken,
        }
    }
}
