import { ValidationError } from '@/shared/errors/entity-errors/validation-error'

enum UserStatusEnum {
    ACTIVE,
    INACTIVE,
    PENDING,
    SUSPENDED,
    DISABLED,
    AWAITING_REVIEW,
    RETRICTED,
}

export class UserStatus {
    static readonly ACTIVE = new UserStatus(UserStatusEnum.ACTIVE, 'ACTIVE')
    static readonly INACTIVE = new UserStatus(
        UserStatusEnum.INACTIVE,
        'INACTIVE',
    )

    static readonly PENDING = new UserStatus(UserStatusEnum.PENDING, 'PENDING')
    static readonly SUSPENDED = new UserStatus(
        UserStatusEnum.SUSPENDED,
        'SUSPENDED',
    )

    static readonly DISABLED = new UserStatus(
        UserStatusEnum.DISABLED,
        'DISABLED',
    )

    static readonly AWAITING_REVIEW = new UserStatus(
        UserStatusEnum.AWAITING_REVIEW,
        'AWAITING_REVIEW',
    )

    static readonly RETRICTED = new UserStatus(
        UserStatusEnum.RETRICTED,
        'RETRICTED',
    )

    private constructor(
        public readonly level: UserStatusEnum,
        public readonly name: string,
    ) {}

    equals(other: UserStatus): boolean {
        return this.level === other.level
    }

    static getUserStatusByName(name: string): UserStatus | null {
        const userStatus = Object.values(UserStatus).find(
            (userStatus) =>
                userStatus instanceof UserStatus &&
                userStatus.name === name.toUpperCase(),
        )

        if (!userStatus) {
            throw new ValidationError('User Status invalid')
        }

        return userStatus
    }
}
