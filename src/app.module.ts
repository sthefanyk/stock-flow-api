import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CreateCategoryController } from './controllers/product-management/category/create-category.controller'
import { CreateNewAccessForEmployee } from './controllers/employee-management/create-access-for-employee.controller'

@Module({
    imports: [],
    controllers: [CreateCategoryController, CreateNewAccessForEmployee],
    providers: [PrismaService],
})
export class AppModule {}
