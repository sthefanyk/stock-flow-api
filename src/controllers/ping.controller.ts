import { Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayload } from 'src/auth/jwt.strategy'

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
