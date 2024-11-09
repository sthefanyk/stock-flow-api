import { ListAllRoleUseCase } from '@/domain/user-and-permission-management/application/use-cases/role/list-all-role'
import { HttpRolePresenter } from '@/infra/http/presenters/http-role.presenter'
import { Controller, Get } from '@nestjs/common'

@Controller('role')
export class ListAllRoleController {
    constructor(private usecase: ListAllRoleUseCase) {}

    @Get()
    async handle() {
        const result = await this.usecase.execute()

        if (result.isLeft()) {
            throw new Error()
        }

        const { roles } = result.value

        return { roles: roles.map(HttpRolePresenter.toHTTP) }
    }
}
