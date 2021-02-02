import { Ability } from '@casl/ability';
import { Body, Controller, Get, HttpCode, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectUser } from 'src/auth/decorators';
import { Action } from 'src/casl/action.enum';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { User } from 'src/users/entities';
import { Broadcast } from '../entities/broadcast.entity';
import { BroadcastsRepository } from '../entities/broadcasts.repository';
import { BroadcastDto } from './broadcast.dto';

@Controller('broadcasts')
export class BroadcastsController {
  constructor(private readonly repo: BroadcastsRepository) { }

  @Get()
  @HttpCode(200)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: Ability) => ability.can(Action.Read, Broadcast))
  async index(): Promise<BroadcastDto[]> {
    return (await this.repo.findAllToBePublishedAndPending()).map(BroadcastDto.fromEntity);
  }

  @Post()
  @HttpCode(201)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: Ability) => ability.can(Action.Create, Broadcast))
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { groups: ['broadcast.create'] }, groups: ['broadcast.create'] }))
  async create(
    @Body() broadcastDto: BroadcastDto,
    @InjectUser() user: User
  ): Promise<BroadcastDto> {
    const broadcast = broadcastDto.toEntity();
    broadcast.setInitialStatus(user);

    return BroadcastDto.fromEntity(await this.repo.save(broadcast));
  }
}
