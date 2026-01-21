import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    create(data: any) {
        return this.prisma.order.create({ data });
    }

    findAll() {
        return this.prisma.order.findMany({ include: { customer: true } });
    }

    findOne(id: string) {
        return this.prisma.order.findUnique({
            where: { id },
            include: { customer: true, accountReceivables: true }
        });
    }

    update(id: string, data: any) {
        return this.prisma.order.update({ where: { id }, data });
    }

    remove(id: string) {
        return this.prisma.order.delete({ where: { id } });
    }
}
