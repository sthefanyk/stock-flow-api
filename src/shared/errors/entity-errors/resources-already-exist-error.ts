import { EntityError } from '../contracts/entity-error'

export class ResourcesAlreadyExistError extends Error implements EntityError {
    constructor(readonly message = 'Resources already exist') {
        super(message)
    }
}
