import { UseCaseError } from '../contracts/use-case-error'

export class ResourceNotFoundError extends Error implements UseCaseError {
    constructor(readonly message = 'Resource not found') {
        super(message)
    }
}
