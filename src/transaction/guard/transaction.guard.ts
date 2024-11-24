import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TransactionGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const userId = context.switchToHttp().getRequest().userId;
        const accountId = context.switchToHttp().getRequest().accountId;
        return this.prisma.account.findUnique({ where: { userId, id: accountId } }) !== undefined;
    }
}
