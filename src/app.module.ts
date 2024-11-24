import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { EntityModule } from './entity/entity.module';
import { HeadersMiddleware } from './headers.middleware';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                ttl: 1000,
                limit: 4,
            },
        ]),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
        UserModule,
        AuthModule,
        PrismaModule,
        AccountModule,
        TransactionModule,
        EntityModule,
        CategoryModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(HeadersMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
