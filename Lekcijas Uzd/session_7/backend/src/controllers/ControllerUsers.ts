import {Body, Controller, Post, Get, Route, FormField, Query} from "tsoa";
import {UserLoginRequest} from "../models/messages/UserLoginRequest";
import {UserLoginResponse} from "../models/messages/UserLoginResponse";
import moment from "moment";
import * as _ from "lodash";

@Route("users")
export class ControllerUsers {

    @Post("login")
    public async login(@Body() request: UserLoginRequest): Promise<UserLoginResponse> {
        let result = {
            session_token: "",
            is_success: false,
            user: {
                username: ""
            }
        } as UserLoginResponse;

        let tempResult = _.cloneDeep(result);
        tempResult.session_token = "dummy";
        // result.session_token , tempResult.session_token

        let listA = [1,2,3];
        let listB = _.clone(listA);
        listB.push(4);

        let timeNow = moment();

        if(request.username === "test" && request.password === "test") {

            let allCombinations = [];
            let randNumber = 1;
            while (randNumber % 3 != 0) { // Modulus 3 does it divide with 3
                randNumber = _.random(0, 20);
                allCombinations.push(randNumber);
            }

            let timeDiff = moment().diff(timeNow);
            console.log(`Secs for searching number: ${timeDiff}`);



            //result.session_token = timeNow.unix().toString(); //milliseconds 1970  Riga
            result.session_token = timeNow.utc().unix().toString(); //milliseconds 1970  GMT
            result.is_success = true;
        }

        return result;
    }
}
