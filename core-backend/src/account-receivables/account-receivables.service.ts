import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountReceivablesService {
    constructor(private prisma: PrismaService) { }

    create(data: any) {
        return this.prisma.accountReceivable.create({ data });
    }

    findAll() {
        return this.prisma.accountReceivable.findMany({ include: { order: true } });
    }

    findOne(id: string) {
        return this.prisma.accountReceivable.findUnique({
            where: { id },
            include: { order: true }
        });
    }

    update(id: string, data: any) {
        return this.prisma.accountReceivable.update({ where: { id }, data });
    }

    remove(id: string) {
        return this.prisma.accountReceivable.delete({ where: { id } });
    }
}
