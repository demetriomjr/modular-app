import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModulesService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.moduleDefinition.findMany({
            where: { enabled: true },
        });
    }

    async findAllIncludingDisabled() {
        return this.prisma.moduleDefinition.findMany();
    }

    async findMine(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                modules: {
                    where: { enabled: true }
                }
            }
        });
        return user?.modules || [];
    }

    async create(data: any) {
        return this.prisma.moduleDefinition.create({
            data
        });
    }

    async update(id: string, data: any) {
        return this.prisma.moduleDefinition.update({
            where: { id },
            data
        });
    }
}
