import { Module } from '@nestjs/common'
import { CreateNewAccessForEmployee } from './controllers/user-and-permission-management/create-access-for-employee.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { PingController } from './controllers/ping.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateRoleUseCase } from '@/domain/user-and-permission-management/application/use-cases/role/create-role'
import { CreateRoleController } from './controllers/user-and-permission-management/role/create-role.controller'
import { ListAllRoleController } from './controllers/user-and-permission-management/role/list-all.controller'
import { ListAllRoleUseCase } from '@/domain/user-and-permission-management/application/use-cases/role/list-all-role'
import { CreateUserUseCase } from '@/domain/user-and-permission-management/application/use-cases/user/create-user'
import { AutheticateUserUseCase } from '@/domain/user-and-permission-management/application/use-cases/user/authenticate-user'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { CreateUseCaseUseCase } from '@/domain/user-and-permission-management/application/use-cases/usecase/create-usecase'
import { ListAllUseCaseUseCase } from '@/domain/user-and-permission-management/application/use-cases/usecase/list-all-usecase'
import { CreateUseCaseController } from './controllers/user-and-permission-management/usecase/create-usecase.controller'
import { ListAllUseCaseController } from './controllers/user-and-permission-management/usecase/list-all.controller'

@Module({
    imports: [DatabaseModule, CryptographyModule],
    controllers: [
        CreateNewAccessForEmployee,
        AuthenticateController,
        PingController,
        CreateRoleController,
        ListAllRoleController,
        CreateUseCaseController,
        ListAllUseCaseController,
    ],
    providers: [
        CreateRoleUseCase,
        ListAllRoleUseCase,
        CreateUserUseCase,
        AutheticateUserUseCase,
        CreateUseCaseUseCase,
        ListAllUseCaseUseCase,
    ],
})
export class HttpModule {}
