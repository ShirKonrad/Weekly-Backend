import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Tag } from "./tag";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    location: string;

    @Column()
    description: string;

    @Column()
    estTime: number;

    @Column()
    dueDate: Date;

    @Column()
    @ManyToOne((type) => Tag)
    @JoinColumn({ name: 'tagId', referencedColumnName: 'id' })
    tagId: number;
}