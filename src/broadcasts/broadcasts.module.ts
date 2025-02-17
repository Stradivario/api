import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Broadcast } from '../broadcasts/entities/broadcast.entity';
import { BroadcastsController } from './api/broadcasts.controller';
import { BroadcastsRepository } from '../broadcasts/entities/broadcasts.repository';
import { BroadcastsPublishTask } from './notifications/broadcasts-publish.task';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Broadcast]), CaslModule, UsersModule],
  providers: [BroadcastsRepository, BroadcastsPublishTask],
  exports: [],
  controllers: [BroadcastsController],
})
export class BroadcastsModule {}
