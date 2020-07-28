import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { UsersModule } from './modules/users/users.module';
@Module({
  imports: [
    DatabaseModule,
    AccountsModule,
    UsersModule
  ],
})
export class AppModule {}
