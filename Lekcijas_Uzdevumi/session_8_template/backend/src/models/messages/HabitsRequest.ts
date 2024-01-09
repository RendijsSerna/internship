import {Habit} from '../db/Habit';

export interface HabitsRequest {
  session_token: string;
  habits: Habit[];
  modified: number; //unix timestamp
}
