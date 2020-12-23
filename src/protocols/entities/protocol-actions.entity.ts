import { Protocol } from './protocol.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { ulid } from "ulid";
import { User } from 'src/users/entities';

export enum ProtocolActionType {
  SEND = 'send',
  ASSIGN = 'assign',
  REJECT = 'reject',
  APPROVE = 'approve',
  PUBLISH = 'publish',
  REPLACE = 'replace',
  POPULATE = 'populate',
}

@Entity('protocol_actions')
export class ProtocolAction {
  @PrimaryColumn('char', {
    length: 26,
  })
  id: string = ulid();

  @ManyToOne(() => Protocol, protocol => protocol.actions)
  protocol: Protocol;

  @ManyToOne(() => User)
  actor: User;

  @Column({ type: 'varchar' })
  action: ProtocolActionType;

  @Column({ type: 'json' })
  payload: object;

  @CreateDateColumn()
  timestamp: Date;

  public static createSendAction(actor: User): ProtocolAction {
    return ProtocolAction.create(ProtocolActionType.SEND, actor);
  }

  public static createAsssignAction(actor: User): ProtocolAction {
    return ProtocolAction.create(ProtocolActionType.ASSIGN, actor);
  }

  public static createRejectAction(actor: User): ProtocolAction {
    return ProtocolAction.create(ProtocolActionType.REJECT, actor);
  }

  public static createApproveAction(actor: User): ProtocolAction {
    return ProtocolAction.create(ProtocolActionType.APPROVE, actor);
  }

  public static createPublishAction(actor?: User): ProtocolAction {
    return ProtocolAction.create(ProtocolActionType.PUBLISH, actor);
  }

  public static createReplaceAction(actor: User): ProtocolAction {
    return ProtocolAction.create(ProtocolActionType.REPLACE, actor);
  }

  public static createPopulateAction(actor: User): ProtocolAction {
    return ProtocolAction.create(ProtocolActionType.POPULATE, actor);
  }

  private static create(actionType: ProtocolActionType, actor?: User): ProtocolAction {
    const action = new ProtocolAction();
    if (actor) {
      action.actor = actor;
    }
    action.action = actionType;

    return action;
  }
}
