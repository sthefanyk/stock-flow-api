import { EntityError } from '../contracts/entity-error'

export class ResourceNotFoundError extends Error implements EntityError {
    constructor(readonly message = 'Resource not found') {
        super(message)
    }
}
