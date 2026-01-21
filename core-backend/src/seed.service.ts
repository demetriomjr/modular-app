import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
    constructor(private readonly prisma: PrismaService) { }

    async onModuleInit() {
        await this.seedAdminUser();
        await this.seedModules();
    }

    private async seedAdminUser() {
        const adminUsername = 'admin';
        const existingUser = await this.prisma.user.findUnique({
            where: { username: adminUsername },
        });

        if (!existingUser) {
            console.log('Seeding admin user...');
            const hashedPassword = await bcrypt.hash('admin', 10);
            await this.prisma.user.create({
                data: {
                    username: adminUsername,
                    name: 'Administrator',
                    password: hashedPassword,
                },
            });
            console.log('Admin user seeded successfully.');
        } else {
            // console.log('Admin user already exists. Skipping seed.');
        }
    }

    private async seedModules() {
        console.log('Resetting and seeding modules...');
        await this.prisma.moduleDefinition.deleteMany();
        const modules = [
            {
                name: 'POS Module',
                route: '/pos',
                menuLabel: 'Ponto de Venda',
                menuGroup: 'Vendas',
                icon: 'Storefront',
                remoteEntry: 'http://localhost:5174/remoteEntry.js',
                scope: 'module_frontend',
                exposedModule: './POS',
                enabled: true
            },
            {
                name: 'Products Module',
                route: '/products',
                menuLabel: 'Produtos',
                menuGroup: 'Cadastros',
                icon: 'ShoppingCart',
                remoteEntry: 'http://localhost:5174/remoteEntry.js',
                scope: 'module_frontend',
                exposedModule: './Products',
                enabled: true
            }
        ];

        const createdModules = [];
        for (const mod of modules) {
            const created = await this.prisma.moduleDefinition.upsert({
                where: { route: mod.route },
                update: mod,
                create: mod,
            });
            createdModules.push(created);
        }

        // Bind all modules to admin user only if they don't have any modules yet
        const admin = await this.prisma.user.findUnique({
            where: { username: 'admin' },
            include: { modules: true }
        });

        if (admin && admin.modules.length === 0) {
            await this.prisma.user.update({
                where: { username: 'admin' },
                data: {
                    modules: {
                        set: createdModules.map(m => ({ id: m.id }))
                    }
                }
            });
            console.log('Modules bound to admin successfully.');
        } else {
            console.log('Admin already has modules or user not found. Skipping auto-binding.');
        }
    }
}
