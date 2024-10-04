import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { CatalogModule } from './catalog/catalog.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, CatalogModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*'); // Apply the middleware to all routes
  }
}
