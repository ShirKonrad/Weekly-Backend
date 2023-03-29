import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity } from "typeorm";
import { Tag } from "./tag";
import { User } from "./user";

@Entity()
export class Event extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    location: string;

    @Column()
    description: string;

    @Column()
    startTime: Date;

    @Column()
    endTime: Date;

    @Column()
    @ManyToOne((type) => Tag)
    @JoinColumn({ name: 'tagId', referencedColumnName: 'id' })
    tagId: number;

    @Column()
    @ManyToOne((type) => User)
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    userId: number;
}