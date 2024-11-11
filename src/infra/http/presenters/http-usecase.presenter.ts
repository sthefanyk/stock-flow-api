import { UseCase } from '@/domain/user-and-permission-management/enterprise/entities/usecase'

export class HttpUseCasePresenter {
    static toHTTP(entity: UseCase) {
        return {
            name: entity.name,
            description: entity.description,
        }
    }
}
