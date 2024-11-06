import { Module } from '@nestjs/common'
import { CreateNewAccessForEmployee } from './controllers/user-and-permission-management/create-access-for-employee.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { PingController } from './controllers/ping.controller'
import { PrismaService } from '../prisma/prisma.service'

@Module({
    imports: [],
    controllers: [
        CreateNewAccessForEmployee,
        AuthenticateController,
        PingController,
    ],
    providers: [PrismaService],
})
export class HttpModule {}
