import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './entities/users.repository';
import { Organization, User } from './entities';
import { OrganizationsRepository } from './entities/organizations.repository';
import { MeController, OrganizationsController, UsersController } from './api/controllers';
import RegistrationService from './api/registration.service';
import { IsOrganizationExistsConstraint } from './api/organization-exists.constraint';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization])],
  providers: [UsersRepository, OrganizationsRepository, RegistrationService, IsOrganizationExistsConstraint],
  exports: [UsersRepository],
  controllers: [UsersController, MeController, OrganizationsController],
})
export class UsersModule {}
