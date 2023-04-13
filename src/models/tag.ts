import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, BaseEntity } from "typeorm";
import { Event } from "./event";
import { Task } from "./task";
import { User } from "./user";

@Entity()
export class Tag extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    // @Column()
    @ManyToOne(() => User, (user) => user.tags)
    // @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    user: User;

    @Column()
    color: string;

}