import { Module } from '@nestjs/common'
import { CreateNewAccessForEmployee } from './controllers/user-and-permission-management/create-access-for-employee.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { PingController } from './controllers/ping.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateRoleUseCase } from '@/domain/user-and-permission-management/application/use-cases/role/create-role'
import { CreateRoleController } from './controllers/user-and-permission-management/role/create-role.controller'
import { ListAllRoleController } from './controllers/user-and-permission-management/role/list-all.controller'
import { ListAllRoleUseCase } from '@/domain/user-and-permission-management/application/use-cases/role/list-all-role'

@Module({
    imports: [DatabaseModule],
    controllers: [
        CreateNewAccessForEmployee,
        AuthenticateController,
        PingController,
        CreateRoleController,
        ListAllRoleController,
    ],
    providers: [CreateRoleUseCase, ListAllRoleUseCase],
})
export class HttpModule {}
