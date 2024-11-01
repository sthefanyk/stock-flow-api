import { Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/auth/current-user.decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { UserPayload } from '@/auth/jwt.strategy'

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
