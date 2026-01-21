import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('payment-methods')
@Controller('payment-methods')
export class PaymentMethodsController {
    @Get()
    findAll() {
        return [
            { id: 'cash', name: 'Dinheiro' },
            { id: 'pix', name: 'PIX' },
            { id: 'debit_card', name: 'Cartão de Débito' },
            { id: 'credit_card', name: 'Cartão de Crédito' },
            { id: 'boleto', name: 'Boleto Bancário' },
            { id: 'bank_transfer', name: 'Transferência Bancária' },
        ];
    }
}
