import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm"
import {OrmUsers} from "./OrmUsers";

@Entity({name: "sessions"})
export class OrmSession {
    @PrimaryGeneratedColumn()
    session_id: number;

    @Column()
    user_id: number;

    @Column()
    device_uuid: string;

    @Column({ default: false })
    IsValid: boolean;

    @Column()
    token: string;

    @OneToOne(type => OrmUsers)
    @JoinColumn({name: "user_id"})
    user: OrmUsers;

}

