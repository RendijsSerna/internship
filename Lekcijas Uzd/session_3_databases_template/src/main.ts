import * as express from "express";
import {Application} from "express";
import * as fs from "fs";
import * as multer from "multer";
import {ControllerDatabase} from "./controllers/ControllerDatabase";


const main = async () => {
    try {
        const app: Application = express();
        const mult = multer();
        app.use(express.json());
        app.use(express.urlencoded({extended: true})); // get data from HTML forms
        app.use(mult.array("data"));

        await ControllerDatabase.instance.connect();


        app.post('/login', async (req, res) => {
            let response = {
                session_token: "",
                success: false
            };


            let request = req.body;



            let session = await ControllerDatabase.instance.login(
                request.username.trim(),
                request.password.trim(),
            )

            if(session){
                response.session_token = session.token;
                response.success = true;
            }



            res.json(response);
        });
        app.post('/add_habit', async (req, res) => {
            let response = {
                success: false
            };

            let request = req.body;


            let session = await ControllerDatabase.instance.add_habit(
                request.session_token,
                request.label.trim(),
            )

            if(session){
                response.success = true;
            }


            res.json(response);
        });

        app.post('/delete_habit', async (req, res) => {
            let response = {
                session_token: "",
                success: false,
                message: ""
            };

            let request = req.body;

            let session = await ControllerDatabase.instance.delete_habit(
            request.session_token,
            request.label.trim()
        );

            if (session) {
                if (session.token) {
                    response.success = true;
                response.message = "Habit deleted successfully.";
            } else {
                response.success = false;
                response.message = "Failed to delete habit.";
            }
        } else {
            response.success = false;
            response.message = "Failed to delete habit.";
        }

            res.json(response);
        });

        app.post('/list_habit', async (req, res) => {
            let response = {
                success: false,
                message: ""
            };

            let request = req.body;

            let session = await ControllerDatabase.instance.list_habit(
                request.session_token
            );

            if(session){
                response.success = true;
                response.message = session;
            }

            res.json(response);
        });


        app.listen(
            8000,
            () => {
                // http://127.0.0.1:8000
                console.log('Server started http://localhost:8000');
            }
        )
    }
    catch (e) {
        console.log(e);
    }
}
main();

