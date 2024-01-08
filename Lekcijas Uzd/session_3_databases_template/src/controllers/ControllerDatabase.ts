import {DataSource} from "typeorm";
import {DbUser} from "../models/db/DbUser";
//import sha1
import * as sha1 from "js-sha1";
import {DbSession} from "../models/db/DbSession";
import {v4 as uuidv4} from 'uuid';
import {OrmUser} from "../models/orm/OrmUser";
import {OrmSession} from "../models/orm/OrmSession";

export class ControllerDatabase {
    //singleton
    private static _instance: ControllerDatabase;
    private constructor() {
        //init litesql datasource
        this.dataSource = new DataSource({
            type: "sqlite",
            database: "./database.sqlite",
            logging: false,
            synchronize: false,
            entities: [
                OrmUser,
                OrmSession
            ]

        })
    }

    public static get instance(): ControllerDatabase {
        if (!ControllerDatabase._instance) {
            ControllerDatabase._instance = new ControllerDatabase();

        }
        return ControllerDatabase._instance;
    }

    //datasource
    private dataSource: DataSource;

    public async connect(): Promise<void> {
        await this.dataSource.initialize();
    }

    public async loginlegacy(
        username:string,
        password:string,
    ): Promise<DbSession>{
        let session: DbSession = null;

        let passwordHashed = sha1(password);
        let rows = await this.dataSource.query(
            "SELECT * FROM users WHERE username = ? AND password = ? AND is_deleted = 0 LIMIT 1",
            [
                username, passwordHashed
            ]
        )
        if(rows.length > 0){
            let row = rows[0];
            let user: DbUser = row as DbUser;


            let token = uuidv4();
            await this.dataSource.query(
                "INSERT INTO sessions (user_id, device_uuid, token) VALUES (?,?,?)",
                [user.user_id, "", token]
            );
            let rowLast = await this.dataSource.query("SELECT last_insert_rowid() as sessions_id");
            session ={
                session_id: rowLast.session_id,
                user_id: user.user_id,
                device_uuid: "",
                token: token,
                is_valid: true,
                user: user
            }
        }

        return session;
    }

    public async add_habit(session_token: string, label: string) {
        let session: DbSession = null;

        const sessionData = await this.dataSource.query(
            "SELECT user_id FROM sessions WHERE token = ? AND isValid = 1",
            [session_token]
        );

        if (sessionData.length > 0) {
            const user_id = sessionData[0].user_id;
            await this.dataSource.query(
                "INSERT INTO habit (user_id, label) VALUES (?, ?)",
                [user_id, label]
            );
        }

        return session;
    }

    public async delete_habit(session_token: string, label: string) {
        let session: DbSession = null;

        const sessionData = await this.dataSource.query(
            "SELECT user_id FROM sessions WHERE token = ? AND isValid = 1",
            [session_token]
        );

        if (sessionData.length > 0) {
            const user_id = sessionData[0].user_id;
            await this.dataSource.query(
                "DELETE FROM habit WHERE user_id = ? AND label = ? ",
                [user_id, label]
            );
        }

        return session;
    }

    public async list_habit(session_token: string) {
        let session: DbSession = null;

        const sessionData = await this.dataSource.query(
            "SELECT user_id FROM sessions WHERE token = ? AND isValid = 1",
            [session_token]
        );

        if (sessionData.length > 0) {
            const user_id = sessionData[0].user_id;
            return await this.dataSource.query(
                "SELECT label FROM habit WHERE user_id = ? AND is_deleted = 0",
                [user_id]
            );
        }

        return session;
    }

    public async login(
        username:string,
        password:string,
    ): Promise<OrmSession>{
        let session: OrmSession = null;

        let passwordHashed = sha1(password);

        let user: OrmUser = await this.dataSource.manager.findOne(OrmUser, {
            where: {
                username: username,
                password: passwordHashed
            }
        });

        if(user){
            session = new OrmSession();
            session.user_id = user.user_id
            session.token = uuidv4();
            await this.dataSource.manager.save(session);

        }


        return session;
    }


}