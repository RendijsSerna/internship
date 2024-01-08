import {Habit} from '../db/Habit';

export interface HabitsResponse {
  is_success: boolean;
  habits: Habit[];
}
