import { Module } from '@nestjs/common';
import { TwoFactorAuthenticationController } from './two-factor-authentication.controller';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { UsersService } from '../users/users.service'
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([
    User]
  )],
  controllers: [TwoFactorAuthenticationController],
  providers: [UsersService, TwoFactorAuthenticationService]
})
export class TwoFactorAuthenticationModule {}
