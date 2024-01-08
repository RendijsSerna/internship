import {Button, Text, TextInput, View} from 'react-native';
import {Habit} from '../../../../../Desktop/session_7/backend/src/models/db/Habit';
import React, {useState} from 'react';
import {ScreenHabits} from '../screens/ScreenHabits.tsx';

interface Props {
  habit: Habit;
  onHabitChange: (habit: Habit) => void;
}

export const ComponentHabit = (props: Props): React.JSX.Element => {
  const [isEditing, setIsEditing] = useState(false);
  const [habitDesc, setHabitDesc] = useState(props.habit.description);
  const [times_per_week, setTimesPerWeek] = useState(
    props.habit.number_of_times_in_week,
  );

  const onEditHabit = () => {
    setIsEditing(true);
  };
  const onDeleteHabit = () => {
    props.onHabitChange({
      habit_id: props.habit.habit_id,
      description: '',
      number_of_times_in_week: 0,
    } as Habit);
  };

  const onSaveHabit = () => {
    setIsEditing(false);
    props.onHabitChange({
      ...props.habit,
      number_of_times_in_week: times_per_week,
      description: habitDesc.trim(),
    } as Habit);
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10,
      }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          padding: 10,
        }}>
        {isEditing ? (
          <View>
            <TextInput onChangeText={text => setHabitDesc(text)}>
              {habitDesc}
            </TextInput>
            <TextInput
              onChangeText={text => {
                let numberInput = parseInt(text);
                if (!isNaN(numberInput)) {
                  numberInput = Math.min(Math.max(1, numberInput), 10);
                  setTimesPerWeek(numberInput);
                }
              }}
              keyboardType="numeric">
              {times_per_week}
            </TextInput>
          </View>
        ) : (
          <View>
            <Text>{habitDesc}</Text>
            <Text>{times_per_week}</Text>
          </View>
        )}
      </View>
      {isEditing ? (
        <View style={{marginRight: 10, padding: 20}}>
          <Button title={'Save'} onPress={onSaveHabit} />
        </View>
      ) : (
        <View style={{flexDirection: 'row'}}>
          <View style={{marginRight: 10}}>
            <Button title={'Delete'} onPress={onDeleteHabit} />
          </View>
          <Button title={'Edit'} onPress={onEditHabit} />
        </View>
      )}
    </View>
  );
};
