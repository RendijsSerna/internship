import React, {useEffect, useState} from 'react';
import {Button, ScrollView, Text, View} from 'react-native';
import {Habit} from '../../../../../Desktop/session_7/backend/src/models/db/Habit';
import {HabitsRequests} from '../../../../../Desktop/session_7/backend/src/models/messages/HabitsRequests.ts';
import {HabitsResponse} from '../../../../../Desktop/session_7/backend/src/models/messages/HabitsResponse.ts';
import {ComponentHabit} from '../components/ComponentHabit.tsx';
import axios, {AxiosResponse} from 'axios';
interface Props {
  title: string;
}
export const ScreenHabits = (props: Props): React.JSX.Element => {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    //habits from backend
    setHabits([
      {
        habit_id: 0,
        description: 'Read book',
        number_of_times_in_week: 3,
      },
      {
        habit_id: 1,
        description: 'Go To Gym',
        number_of_times_in_week: 2,
      },
    ]);
    return () => {};
  }, []);
  const onAddHabit = () => {
    setHabits([
      ...habits,
      {
        habit_id: habits.length + 1,
        description: 'New Habit',
        number_of_times_in_week: 0,
      },
    ]);
    syncWithBackend();
  };
  const onHabitEdit = (habit: Habit) => {
    const updatedHabits = [...habits];
    if (habit.description === '' && habit.number_of_times_in_week === 0) {
      const indexToRemove = updatedHabits.findIndex(
        h => h.habit_id === habit.habit_id,
      );

      if (indexToRemove !== -1) {
        updatedHabits.splice(indexToRemove, 1);
        setHabits(updatedHabits);
        updatedHabits.forEach(value => {
          console.log(value);
        });

        syncWithBackend();
      }
    }

    const idxHabit = updatedHabits.findIndex(
      h => h.habit_id === habit.habit_id,
    );
    if (idxHabit >= 0) {
      updatedHabits[idxHabit] = habit;
      setHabits(updatedHabits);
      habits.forEach(value => {
        console.log(value);
      });
      syncWithBackend();
    }
  };
  const syncWithBackend = async () => {
    let habitsRequest: HabitsRequests = {
      session_token: '',
      habits: habits,
      modified: new Date().getTime(),
    };
    let response: AxiosResponse<HabitsResponse> = await axios.post(
      'http://localhost:8080/habits/update',
      habitsRequest,
    );
    let habitsResponse: HabitsResponse = response.data;

    console.log(habitsResponse);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'lightgrey',
        padding: 20,
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 24,
          paddingBottom: 20,
          textAlign: 'center',
        }}>
        {props.title}
      </Text>
      <ScrollView style={{backgroundColor: 'white', flex: 1, marginBottom: 20}}>
        {habits.map((habit, index) => (
          <ComponentHabit
            key={index}
            habit={habit}
            onHabitChange={onHabitEdit}
          />
        ))}
      </ScrollView>
      <Button title={'Add Habit'} onPress={onAddHabit} />
    </View>
  );
};
