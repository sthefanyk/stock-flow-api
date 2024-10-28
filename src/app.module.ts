import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CreateCategoryController } from './controllers/product-management/category/create-category.controller'

@Module({
    imports: [],
    controllers: [CreateCategoryController],
    providers: [PrismaService],
})
export class AppModule {}
