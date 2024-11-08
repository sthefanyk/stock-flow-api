import { ActionLogDAO } from '@/domain/activity-log/application/DAO/action-log-dao'
import { ActionLog } from '@/domain/activity-log/enterprise/entities/action-log'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { PrismaActionLogMapper } from '../../mappers/activity-log/prisma-action-log-mapper'

@Injectable()
export class PrismaActionLogRepository implements ActionLogDAO {
    constructor(private prisma: PrismaService) {}

    async create(entity: ActionLog): Promise<void> {
        await this.prisma.actionLog.create({
            data: PrismaActionLogMapper.toPrisma(entity),
        })
    }

    async delete(entity: ActionLog): Promise<void> {
        await this.prisma.actionLog.delete({
            where: { id: entity.id.toString() },
        })
    }

    async findById(id: string): Promise<ActionLog | null> {
        const prismaActionLog = await this.prisma.actionLog.findUnique({
            where: { id },
        })

        if (prismaActionLog) {
            return PrismaActionLogMapper.toEntity(prismaActionLog)
        }

        return null
    }

    async findByAction(usecase: string): Promise<ActionLog[]> {
        const prismaActionLog = await this.prisma.actionLog.findMany({
            where: { use_case_name: usecase },
        })

        return prismaActionLog.map(PrismaActionLogMapper.toEntity)
    }

    async findByDateInterval(
        initialDate: Date,
        endDate: Date,
    ): Promise<ActionLog[]> {
        const prismaActionLog = await this.prisma.actionLog.findMany({
            where: {
                date: {
                    gte: initialDate,
                    lte: endDate,
                },
            },
        })

        return prismaActionLog.map(PrismaActionLogMapper.toEntity)
    }

    async searchInDetails(details: string): Promise<ActionLog[]> {
        const prismaActionLog = await this.prisma.actionLog.findMany({
            where: {
                details: {
                    contains: details,
                },
            },
        })

        return prismaActionLog.map(PrismaActionLogMapper.toEntity)
    }

    async listAll(): Promise<ActionLog[]> {
        const prismaActionLog = await this.prisma.actionLog.findMany()
        return prismaActionLog.map(PrismaActionLogMapper.toEntity)
    }
}
