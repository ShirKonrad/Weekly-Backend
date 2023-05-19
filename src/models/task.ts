import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity, CreateDateColumn } from "typeorm";
import { Priority } from "../helpers/constants";
import { Tag } from "./tag";
import { User } from "./user";

export interface ITask {
    id: number;
    title: string;
    location?: string;
    description?: string;
    estTime: number;
    dueDate: Date;
    tag?: Tag;
    priority: number;
    assignment?: Date;
    isDone?: boolean;
}

@Entity()
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    location?: string;

    @Column({ nullable: true })
    description?: string;

    @Column()
    estTime: number;

    @Column()
    dueDate: Date;

    // @Column({ nullable: true })
    @ManyToOne(() => Tag)
    // @JoinColumn({ name: 'tagId', referencedColumnName: 'id' })
    tag?: Tag;

    // @Column()
    @ManyToOne(() => User)
    // @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    user: User;

    @Column({
        type: "enum",
        enum: Priority,
        default: 3
    })
    priority: number;

    @Column({ nullable: true })
    assignment?: Date;

    @Column({ default: false })
    isDone: boolean;
}