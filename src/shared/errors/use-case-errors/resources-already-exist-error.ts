import { UseCaseError } from '../contracts/use-case-error'

export class ResourcesAlreadyExistError extends Error implements UseCaseError {
    constructor(readonly message = 'Resources already exist') {
        super(message)
    }
}
