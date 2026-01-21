import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) { }

    @Post()
    create(@Body() data: any) {
        return this.customersService.create(data);
    }

    @Get()
    findAll() {
        return this.customersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.customersService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.customersService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.customersService.remove(id);
    }
}
