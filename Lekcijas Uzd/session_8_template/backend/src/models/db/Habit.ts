export interface Habit {
  habit_id?: number | null;
  user_id?: number;
  description: string;
  number_of_times_in_week: number;
}
