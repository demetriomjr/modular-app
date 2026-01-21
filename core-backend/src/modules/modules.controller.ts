import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('modules')
@Controller('modules')
export class ModulesController {
    constructor(private readonly modulesService: ModulesService) { }

    @Get()
    findAll() {
        return this.modulesService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('mine')
    findMine(@Request() req: any) {
        return this.modulesService.findMine(req.user.userId);
    }

    @Get('all')
    findAllIncludingDisabled() {
        return this.modulesService.findAllIncludingDisabled();
    }

    @Post()
    create(@Body() body: any) {
        return this.modulesService.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.modulesService.update(id, body);
    }
}
