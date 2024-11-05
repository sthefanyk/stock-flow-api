import { UserGroup } from '@/domain/user-and-permission-management/enterprise/entities/user-group'
import { InMemoryUserGroupRepository } from '@/infra/repositories/in-memory/user-and-permission-management/in-memory-user-group-repository'
import { makeUserGroup } from '@/test/factories/user-and-permission-management/make-user-group'
import { TestContext } from 'vitest'
import { PermissionDAO } from '../../DAO/permission-dao'
import { UserGroupDAO } from '../../DAO/user-group-dao'
import { Permission } from '@/domain/user-and-permission-management/enterprise/entities/permission'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { AddPermissionToUserGroupUseCase } from './add-permission-to-user-group'
import { InMemoryPermissionRepository } from '@/infra/repositories/in-memory/user-and-permission-management/in-memory-permission-repository'
import { makePermission } from '@/test/factories/user-and-permission-management/make-permission'
import { ResourcesAlreadyExistError } from '@/shared/errors/entity-errors/resources-already-exist-error'

interface TestContextWithSut extends TestContext {
    permissionRepository: PermissionDAO
    userGroupRepository: UserGroupDAO
    permission: Permission
    userGroup: UserGroup
    sut: AddPermissionToUserGroupUseCase
}

describe('AddUserToUserGroupUseCase', () => {
    beforeEach(async (context: TestContextWithSut) => {
        context.userGroupRepository = new InMemoryUserGroupRepository()
        context.permissionRepository = new InMemoryPermissionRepository()

        context.permission = makePermission()
        context.userGroup = makeUserGroup()

        context.userGroupRepository.create(context.userGroup)
        context.permissionRepository.create(context.permission)

        context.sut = new AddPermissionToUserGroupUseCase(
            context.userGroupRepository,
            context.permissionRepository,
        )
    })

    it('should be able to add permission in user group', async ({
        sut,
        permission,
        userGroup,
        userGroupRepository,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            nameGroup: userGroup.name.toUpperCase(),
            permissionID: permission.id.toString(),
        })

        expect(result.isRight()).toBe(true)
        const userGroupResult = result.value as { userGroup: UserGroup }
        expect(userGroupResult.userGroup.name).toBe(userGroup.name)

        const items = await userGroupRepository.listAll()

        expect(items[0].permissions[3].equals(permission)).toBeTruthy()
        expect(items[0].permissions).toHaveLength(4)
    })

    it('should return a ResourcesAlreadyExistError if permission already exists in user group', async ({
        sut,
        userGroup,
        permission,
        userGroupRepository,
    }: TestContextWithSut) => {
        await sut.execute({
            nameGroup: userGroup.name.toUpperCase(),
            permissionID: permission.id.toString(),
        })

        const result = await sut.execute({
            nameGroup: userGroup.name,
            permissionID: permission.id.toString(),
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourcesAlreadyExistError)

        const { message } = result.value as ResourcesAlreadyExistError
        expect(message).toBe('Permission already exist in user group')

        const items = await userGroupRepository.listAll()
        expect(items[0].permissions).length(4)
    })

    it('should return a ResourceNotFoundError if the user group is not found', async ({
        sut,
        permission,
        userGroupRepository,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            nameGroup: 'unregistered',
            permissionID: permission.id.toString(),
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)

        const { message } = result.value as ResourceNotFoundError
        expect(message).toBe('User group not found')

        const items = await userGroupRepository.listAll()
        expect(items[0].permissions).length(3)
    })

    it('should return a ResourceNotFoundError if the permission is not found', async ({
        sut,
        userGroup,
        userGroupRepository,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            nameGroup: userGroup.name,
            permissionID: 'unregistered',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)

        const { message } = result.value as ResourceNotFoundError
        expect(message).toBe('Permission not found')

        const items = await userGroupRepository.listAll()
        expect(items[0].permissions).length(3)
    })
})
