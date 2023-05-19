import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity } from "typeorm";
import { Tag } from "./tag";
import { User } from "./user";

export interface IEvent {
    id: number;
    title: string;
    location?: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    tag?: Tag;
    userId: number;
}

@Entity()
export class Event extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    startTime: Date;

    @Column()
    endTime: Date;

    // @Column({ nullable: true })
    @ManyToOne(() => Tag)
    // @JoinColumn({ name: 'tagId', referencedColumnName: 'id' })
    tag: Tag;

    // @Column()
    @ManyToOne(() => User)
    // @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    user: User;
}