import { Habit } from "../../../../backend/src/models/db/Habit";
import { View, Text, Button, TextInput } from "react-native";
import { useState } from "react";
import RNPickerSelect from 'react-native-picker-select';
interface Props {
	habit: Habit;
	number_of_times_in_week: number;
	onHabitChange: (habit: Habit) => void;
}
export const ComponentHabit = (props: Props): React.JSX.Element => {
	const [isEditing, setIsEditing] = useState(false);
	const [habitDesc, setHabitDesc] = useState(props.habit.description);
	const [number_of_times_in_week, set_number_of_times] = useState(props.habit.number_of_times_in_week);

	const onEditHabit = () => {
		setIsEditing(true);
	};
	const onDeleteHabit = () => {};

	const onSaveHabit = () => {
		setIsEditing(false);
		if (props.onHabitChange) {
			props.onHabitChange({
				...props.habit,
				number_of_times_in_week: number_of_times_in_week,
				description: habitDesc.trim(),
			} as Habit);
		}
	};
	const sports = [
		{ label: '1', value: '1' },
		{ label: '2', value: '2' },
		{ label: '3', value: '3' },
		{ label: '4', value: '4' },
		{ label: '5', value: '5' },
		{ label: '6', value: '6' },
		{ label: '7', value: '7' },
		{ label: '8', value: '8' },
		{ label: '9', value: '9' },
		{ label: '10', value: '10' },
	];


	return (
		<View
			style={{
				flex: 1,
				flexDirection: "row",
				marginBottom: 10,
			}}>
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					paddingLeft: 10,
				}}>
				{isEditing ? (

					<View>
						<TextInput onChangeText={(text) => setHabitDesc(text)}>{habitDesc}</TextInput>
						<RNPickerSelect
							placeholder={{
								label: 'Select the number of times per week',
								value: null,
								color: 'red',
							}}
									 items={sports}
							onValueChange={(value) => set_number_of_times(value)}
							 />
					</View>

				) : (
					<View>
						<Text>{habitDesc}</Text>
						<Text>{number_of_times_in_week}</Text>
					</View>


				)}
			</View>
			{isEditing ? (
				<Button title={"Save"} onPress={onSaveHabit}></Button>

			) : (
				<View style={{ flexDirection: "row" }}>
					<View style={{ marginRight: 10 }}>
						<Button title={"Delete"} onPress={onDeleteHabit}></Button>
					</View>
					<Button title={"Edit"} onPress={onEditHabit}></Button>
				</View>

			)}

		</View>
	);
};
