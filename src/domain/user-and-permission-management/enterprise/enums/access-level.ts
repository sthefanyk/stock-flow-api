import { ValidationError } from '@/shared/errors/entity-errors/validation-error'

enum AccessLevelEnum {
    CREATE,
    DELETE,
    EDIT,
    VIEW,
    MANAGE,
}

export class AccessLevel {
    static readonly CREATE = new AccessLevel(AccessLevelEnum.CREATE, 'CREATE')
    static readonly DELETE = new AccessLevel(AccessLevelEnum.DELETE, 'DELETE')
    static readonly EDIT = new AccessLevel(AccessLevelEnum.EDIT, 'EDIT')
    static readonly VIEW = new AccessLevel(AccessLevelEnum.VIEW, 'VIEW')
    static readonly MANAGE = new AccessLevel(AccessLevelEnum.MANAGE, 'MANAGE')

    private constructor(
        public readonly level: AccessLevelEnum,
        public readonly name: string,
    ) {}

    equals(other: AccessLevel): boolean {
        return this.level === other.level
    }

    static getAccessLevelByName(name: string): AccessLevel | null {
        const accessLevel = Object.values(AccessLevel).find(
            (accessLevel) =>
                accessLevel instanceof AccessLevel &&
                accessLevel.name === name.toUpperCase(),
        )

        if (!accessLevel) {
            throw new ValidationError('Access Level invalid')
        }

        return accessLevel
    }
}
