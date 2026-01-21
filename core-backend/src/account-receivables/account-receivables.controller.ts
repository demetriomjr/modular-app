import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountReceivablesService } from './account-receivables.service';

@Controller('account-receivables')
export class AccountReceivablesController {
    constructor(private readonly accountReceivablesService: AccountReceivablesService) { }

    @Post()
    create(@Body() data: any) {
        return this.accountReceivablesService.create(data);
    }

    @Get()
    findAll() {
        return this.accountReceivablesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.accountReceivablesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.accountReceivablesService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.accountReceivablesService.remove(id);
    }
}
