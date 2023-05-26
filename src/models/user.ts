import { BaseEntity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from "typeorm/decorator/entity/Entity";
import { Tag } from "./tag";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    beginDayHour: number;

    @Column()
    endDayHour: number;
    
    @OneToMany(() => Tag, (tag) => tag.user)
    tags?: Tag[];
}