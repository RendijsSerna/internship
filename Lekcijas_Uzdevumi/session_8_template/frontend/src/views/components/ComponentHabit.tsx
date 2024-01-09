import { Habit } from "../../../../backend/src/models/db/Habit";
import { View, Text, Button, TextInput } from "react-native";
import { useState } from "react";
interface Props {
	habit: Habit;
	onHabitChange: (habit: Habit) => void;
}
export const ComponentHabit = (props: Props): React.JSX.Element => {
	const [isEditing, setIsEditing] = useState(false);
	const [habitDesc, setHabitDesc] = useState(props.habit.description);
	const onEditHabit = () => {
		setIsEditing(true);
	};
	const onDeleteHabit = () => {};

	const onSaveHabit = () => {
		setIsEditing(false);
		if (props.onHabitChange) {
			props.onHabitChange({
				...props.habit,
				//number_of_times_in_week: props.habit.number_of_times_in_week,
				description: habitDesc.trim(),
			} as Habit);
		}
	};

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
					<TextInput onChangeText={(text) => setHabitDesc(text)}>{habitDesc}</TextInput>
				) : (
					<Text>{habitDesc}</Text>
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
