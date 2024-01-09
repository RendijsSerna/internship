import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm"
import {OrmSession} from "./OrmSession";


@Entity({name: "todos"})
export class OrmTodos {
    @PrimaryGeneratedColumn()
    todo_id: number;

    @Column()
    title: string;

    @Column()
    token: string;

    @OneToOne(type => OrmSession)
    @JoinColumn({name: "token"})
    user: OrmSession;

}

