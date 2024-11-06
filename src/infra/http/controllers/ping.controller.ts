import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Controller, Post, UseGuards } from '@nestjs/common'

@Controller('/ping')
@UseGuards(JwtAuthGuard)
export class PingController {
    constructor() {}

    @Post()
    async handle(@CurrentUser() user: UserPayload) {
        console.log(user.sub)

        return 'pong ' + user.sub
    }
}
