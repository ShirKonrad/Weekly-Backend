import { BaseEntity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from "typeorm/decorator/entity/Entity";
import { Tag } from "./tag";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column()
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    resetToken: string;

    @Column({ default: 0 })
    beginDayHour: number;

    @Column({ default: 0 })
    endDayHour: number;
    
    @OneToMany(() => Tag, (tag) => tag.user)
    tags?: Tag[];
}