import { Module } from '@nestjs/common';
import { AccountReceivablesService } from './account-receivables.service';
import { AccountReceivablesController } from './account-receivables.controller';

@Module({
  providers: [AccountReceivablesService],
  controllers: [AccountReceivablesController]
})
export class AccountReceivablesModule {}
