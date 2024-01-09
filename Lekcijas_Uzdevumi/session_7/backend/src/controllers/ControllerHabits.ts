import {Body, Controller, Post, Get, Route, FormField, Query} from "tsoa";
import {UserLoginRequest} from "../models/messages/UserLoginRequest";
import {UserLoginResponse} from "../models/messages/UserLoginResponse";
import moment from "moment";
import * as _ from "lodash";
import {HabitsRequests} from "../models/messages/HabitsRequests";
import {HabitsResponse} from "../models/messages/HabitsResponse";
import {result} from "lodash";

@Route("users")
export class ControllerHabits {

    @Post("update")
    public async update(@Body() request: HabitsRequests): Promise<HabitsResponse> {
        let result = {
            is_success: false,
            habits: []

        } as HabitsResponse
        console.log('update habits');
        console.log(request)


        return result;
    }
}
