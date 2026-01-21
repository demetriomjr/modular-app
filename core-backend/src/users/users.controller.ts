import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    create(@Body() body: { username: string; password: string; name: string }) {
        return this.usersService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.usersService.delete(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post(':id/modules')
    updateModules(@Param('id') id: string, @Body() body: { moduleIds: string[] }) {
        return this.usersService.updateModules(id, body.moduleIds);
    }
}
