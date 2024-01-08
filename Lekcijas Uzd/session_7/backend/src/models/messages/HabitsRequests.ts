import {Habit} from "../db/Habit";

export interface HabitsRequests{
    session_token: string;
    habits: Habit[];
    modified: number; //unix
}
