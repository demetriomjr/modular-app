import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { AccountReceivablesModule } from './account-receivables/account-receivables.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import { SeedService } from './seed.service';

import { ModulesModule } from './modules/modules.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';

@Module({
  imports: [
    PrismaModule,
    SuppliersModule,
    CustomersModule,
    OrdersModule,
    AccountReceivablesModule,
    UsersModule,
    AuthModule,
    ModulesModule,
    PaymentMethodsModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule { }
