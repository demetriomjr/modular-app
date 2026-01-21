import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(data: { username: string; password: string; name: string }) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.prisma.user.create({
            data: {
                username: data.username,
                password: hashedPassword,
                name: data.name,
            },
            select: {
                id: true,
                username: true,
                name: true,
                createdAt: true,
            },
        });
    }

    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                username: true,
                name: true,
                createdAt: true,
                modules: true,
            },
        });
    }

    async findByUsername(username: string) {
        return this.prisma.user.findUnique({
            where: { username },
            include: { modules: true },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                name: true,
                createdAt: true,
                modules: true,
            },
        });
    }

    async updateModules(userId: string, moduleIds: string[]) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                modules: {
                    set: moduleIds.map(id => ({ id })),
                },
            },
            select: {
                id: true,
                username: true,
                modules: true,
            }
        });
    }

    async delete(id: string) {
        return this.prisma.user.delete({
            where: { id },
        });
    }
}
