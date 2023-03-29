import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity } from "typeorm";
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
    tagId?: number;
    userId: number;
    priority: number;
    assignment?: Date;
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

    @Column({ nullable: true })
    @ManyToOne((type) => Tag)
    @JoinColumn({ name: 'tagId', referencedColumnName: 'id' })
    tagId?: number;

    @Column()
    @ManyToOne((type) => User)
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    userId: number;

    @Column({
        type: "enum",
        enum: Priority,
        default: 3
    })
    priority: number;

    @Column({ nullable: true })
    assignment?: Date;
}