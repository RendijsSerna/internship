import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({name: "users"})
export class OrmUsers {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: false })
    is_activated: boolean;

    @Column()
    created: Date;


}
