import { Controller, Get, Post, Body } from '@nestjs/common';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Post()
    create(@Body() createSaleDto: { items: { productId: string; quantity: number }[] }) {
        return this.salesService.createSale(createSaleDto);
    }

    @Get()
    findAll() {
        return this.salesService.findAll();
    }
}
