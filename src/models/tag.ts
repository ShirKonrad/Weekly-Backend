import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./user";

@Entity()
export class Tag  {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    @ManyToOne((type) => User)
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    userId: number;

    @Column()
    color: string;
}