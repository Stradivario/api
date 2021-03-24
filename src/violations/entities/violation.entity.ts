import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { ulid } from 'ulid';
import { Section, Town } from '../../sections/entities';
import { Picture } from '../../pictures/entities/picture.entity';
import { User } from '../../users/entities';
import { ViolationUpdate, ViolationUpdateType } from './violation-update.entity';

export enum ViolationStatus {
  RECEIVED = 'received',
  PROCESSING = 'processing',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  PUBLISHED = 'published',
};

@Entity('violations')
export class Violation {
  @PrimaryColumn('char', {
    length: 26,
  })
  id: string = ulid();

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar' })
  status: ViolationStatus;

  @ManyToOne(() => Section, section => section.violations)
  section?: Section;

  @ManyToOne(() => Town, town => town.violations)
  town: Town;

  @ManyToMany(() => Picture)
  @JoinTable({
    name: 'violations_pictures',
    joinColumn: { name: 'violation_id' },
    inverseJoinColumn: { name: 'picture_id' },
  })
  pictures: Picture[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'violations_assignees',
    joinColumn: { name: 'violation_id' },
    inverseJoinColumn: { name: 'assignee_id' },
  })
  assignees: User[];

  @OneToMany(() => ViolationUpdate, (update: ViolationUpdate) => update.violation, {
    cascade: ['insert', 'update'],
  })
  updates: ViolationUpdate[];

  getAuthor(): User {
    return this.updates.find((update: ViolationUpdate) => update.type = ViolationUpdateType.SEND).actor;
  }

  public getUpdates(): ViolationUpdate[] {
    return this.updates || [];
  }

  setReceivedStatus(sender: User): void {
    if (this.status) {
      throw new Error('Violation status cannot be set to received when not empty!');
    }
    this.status = ViolationStatus.RECEIVED;
    this.addUpdate(ViolationUpdate.createSendUpdate(sender));
  }

  assign(actor: User, assignees: User[]): void {
    if (this.status === ViolationStatus.RECEIVED) {
      this.status = ViolationStatus.PROCESSING;
    }
    this.assignees = assignees;
    this.addUpdate(ViolationUpdate.createAsssignUpdate(actor, assignees));
  }

  reject(actor: User): void {
    if (this.status !== ViolationStatus.PROCESSING) {
      throw new Error('Violation can be rejected only if it is in processing!');
    }

    this.status = ViolationStatus.REJECTED;
    this.addUpdate(ViolationUpdate.createRejectUpdate(actor));
  }

  accept(actor: User): void {
    if (this.status !== ViolationStatus.PROCESSING) {
      throw new Error('Violation can be accepted only if it is in processing!');
    }

    this.status = ViolationStatus.ACCEPTED;
    this.addUpdate(ViolationUpdate.createAcceptUpdate(actor));
  }

  publish(): void {
    if (this.status !== ViolationStatus.ACCEPTED) {
      throw new Error('Violation can be published only if it is approved!');
    }

    this.status = ViolationStatus.PUBLISHED;
    this.addUpdate(ViolationUpdate.createPublishUpdate());
  }

  private addUpdate(update: ViolationUpdate): void {
    update.violation = this;
    this.updates = (this.updates || []).concat([update]);
  }
}
