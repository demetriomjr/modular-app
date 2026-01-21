import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class SalesService {
    private readonly coreApiUrl = process.env.CORE_API_URL || 'http://localhost:3000';

    constructor(private prisma: PrismaService) { }

    async createSale(data: {
        items: { productId: string; quantity: number }[];
        paymentMethod?: string;
        installments?: number;
        isPaid?: boolean;
    }) {
        // In a real app we would calculate totals from DB prices. 
        // For this mock/basic version, we'll assume we fetch prices or they are passed (unsafe).
        // Let's fetch products to be safe and "basic correct".

        let totalSaleAmount = 0;
        const saleItemsData: { productId: string; quantity: number; unitPrice: any; total: number }[] = [];

        for (const item of data.items) {
            const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
            if (!product) continue; // Skip invalid products

            const itemTotal = Number(product.price) * item.quantity;
            totalSaleAmount += itemTotal;

            saleItemsData.push({
                productId: product.id,
                quantity: item.quantity,
                unitPrice: product.price,
                total: itemTotal,
            });

            // Update stock
            await this.prisma.product.update({
                where: { id: item.productId },
                data: { stock: product.stock - item.quantity },
            });
        }

        const sale = await this.prisma.sale.create({
            data: {
                totalAmount: totalSaleAmount,
                paymentMethod: data.paymentMethod,
                installments: data.installments || 1,
                isPaid: data.isPaid || false,
                items: {
                    create: saleItemsData,
                },
            },
            include: { items: true },
        });

        // Consuming core-backend to create a receivable
        try {
            await axios.post(`${this.coreApiUrl}/account-receivables`, {
                description: `Venda #${sale.id.substring(0, 8)}`,
                amount: totalSaleAmount,
                dueDate: new Date().toISOString(),
                status: data.isPaid ? 'PAID' : 'OPEN',
                paymentMethod: data.paymentMethod || 'OUTRO',
                installments: data.installments || 1,
            });
        } catch (error) {
            console.error('Failed to create receivable in core-backend', error);
            // We don't throw here to avoid rolling back the sale if core is down, 
            // but in a production app we might want to use a job queue or transaction.
        }

        return sale;
    }

    async findAll() {
        return this.prisma.sale.findMany({
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
}
