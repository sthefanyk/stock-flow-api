import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CreateCategoryController } from './controllers/product-management/category/create-category.controller'
import { CreateNewAccessForEmployee } from './controllers/employee-management/create-access-for-employee.controller'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { PingController } from './controllers/ping.controller'

@Module({
    imports: [
        ConfigModule.forRoot({
            validate: (env) => envSchema.parse(env),
            isGlobal: true,
        }),
        AuthModule,
    ],
    controllers: [
        CreateCategoryController,
        CreateNewAccessForEmployee,
        AuthenticateController,
        PingController,
    ],
    providers: [PrismaService],
})
export class AppModule {}
