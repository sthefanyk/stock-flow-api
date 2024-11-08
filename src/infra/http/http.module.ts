import { Module } from '@nestjs/common'
import { CreateNewAccessForEmployee } from './controllers/user-and-permission-management/create-access-for-employee.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { PingController } from './controllers/ping.controller'
import { DatabaseModule } from '../database/database.module'

@Module({
    imports: [DatabaseModule],
    controllers: [
        CreateNewAccessForEmployee,
        AuthenticateController,
        PingController,
    ],
})
export class HttpModule {}
