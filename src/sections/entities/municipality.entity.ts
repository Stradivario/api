import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, OneToMany, ManyToMany } from 'typeorm';
import { CityRegion } from './cityRegion.entity';
import { ElectionRegion } from './electionRegion.entity';
import { Town } from './town.entity';

@Entity('municipalities')
export class Municipality {
  @PrimaryColumn()
  readonly id: number;

  @Column('char', { length: 2 })
  readonly code: string;

  @Column()
  readonly name: string;

  @ManyToMany(
    () => ElectionRegion,
    (electionRegion) => electionRegion.municipalities,
  )
  readonly electionRegions: ElectionRegion[];

  @OneToMany(() => Town, (town) => town.municipality)
  readonly towns: Town[];

  sectionsCount: number;

  @ApiProperty({ type: () => CityRegion })
  cityRegions: Record<string, CityRegion> = {};
}
