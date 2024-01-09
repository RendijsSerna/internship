import {Body, Get, Post, Route} from "tsoa";
import {UserLogInRequest} from "../models/messages/UserLogInRequest";
import {UserLogInResponse} from "../models/messages/UserLogInResponse";
import {OrmUsers} from "../models/orm/OrmUsers";
import {DatabaseConnection} from "./DatabaseConnection";
import {v4 as uuidv4} from 'uuid';
import {OrmSession} from "../models/orm/OrmSession";

@Route("users")
export class ControllerUsers {
    private dbConnection = DatabaseConnection.instance;


    @Post("login")
    public async login(@Body() request: UserLogInRequest): Promise<UserLogInResponse> {
        let result: UserLogInResponse = {
            session_token: '',
            is_success: false
        } as UserLogInResponse;

        let user = await this.dbConnection.dataSource.manager.findOne(OrmUsers,
            {where: {email: request.email, password: request.password, is_activated: true}});

        if(user){
            return {
                session_token: 'worked',
                is_success: true
            };

        }
        else{
           return result
        }


    }

    @Post("register")
    public async register(@Body() userData: { email: string, password: string }): Promise<any> {
        const { email, password } = userData;
        const newUser = new OrmUsers();
        const newSession = new OrmSession();
        newUser.email = email;
        newUser.password = password;
        newUser.created = new Date();

        await this.dbConnection.dataSource.manager.save(newUser);
        let token = uuidv4();
        newSession.token = token
        newSession.user_id = newUser.user_id;


        let url = "http://localhost:8000/users/confirmation/"+token;


        /*let transporter = nodemailer.createTransport({
            host: "mail.inbox.lv",
            port: 587,
            secure: false,
            auth:{
                user: '',
                pass: '',
            },

        });
        await  transporter.sendMail({
            from: '',
            to: `${newUser.email}`,
            subject: "Not a scam",
            text: "test",
            html: `<div>NotAScam <a href="${url}">${url}</a></div>`
        });*/
        console.log(url);

        await this.dbConnection.dataSource.manager.save(newSession);

    };
    @Get("confirmation/:token")
    public async confirmation(): Promise<any> {


        const url = "http://localhost:8000/users/confirmation/{token}";
        const parts = url.split("/");
        const token2 = parts[parts.length - 1];
        console.log(token2);

        const token = 'ddfd85b2-5c70-484f-8b96-e5ee1d7628fc'
        const session = await this.dbConnection.dataSource.manager.findOne(OrmSession,
            { where: { token }, relations: ["user"] });

        if (session) {
            session.user.is_activated = true;


            await this.dbConnection.dataSource.manager.save(session.user);



            return "User status updated successfully";
        } else {
            return "Invalid token";
        }
    }

};
