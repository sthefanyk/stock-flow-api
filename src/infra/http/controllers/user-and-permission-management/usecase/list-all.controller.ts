import { ListAllUseCaseUseCase } from '@/domain/user-and-permission-management/application/use-cases/usecase/list-all-usecase'
import { HttpUseCasePresenter } from '@/infra/http/presenters/http-usecase.presenter'
import { Controller, Get } from '@nestjs/common'

@Controller('usecase')
export class ListAllUseCaseController {
    constructor(private usecase: ListAllUseCaseUseCase) {}

    @Get()
    async handle() {
        const result = await this.usecase.execute()

        if (result.isLeft()) {
            throw new Error()
        }

        const { usecases } = result.value

        return { usecases: usecases.map(HttpUseCasePresenter.toHTTP) }
    }
}
