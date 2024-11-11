import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Controller, Post } from '@nestjs/common'

@Controller('/ping')
export class PingController {
    constructor() {}

    @Post()
    async handle(@CurrentUser() user: UserPayload) {
        console.log(user.sub)

        return 'pong ' + user.sub
    }
}
