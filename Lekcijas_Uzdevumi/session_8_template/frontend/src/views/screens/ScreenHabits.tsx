import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Button } from "react-native";
import axios, { AxiosResponse } from "axios";
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import { Habit } from "../../../../backend/src/models/db/Habit";
import { HabitsRequest } from "../../../../backend/src/models/messages/HabitsRequest";
import { HabitsResponse } from "../../../../backend/src/models/messages/HabitsResponse";
import { ComponentHabit } from "../components/ComponentHabit";

interface Props {
	title: string;
	onHabitsCountChange: (count: number) => void;
}
export const ScreenHabits = (props: Props): React.JSX.Element => {
	const [habits, setHabits] = useState<Habit[]>([]);
	const navigation = useNavigation<NavigationProp<any>>();
	const route = useRoute();
	const updateHabitsCountChange= () => {
		props.onHabitsCountChange(habits.length)
	};

	useEffect(() => {
			// constructor
			// TODO: get habits from backend
			const initialHabits=([
				{
					habit_id: 0,
					user_id: 0,
					description: "Read book",
					number_of_times_in_week: 3
				},
				{
					habit_id: 1,
					user_id: 0,
					description: "Go to gym",
					number_of_times_in_week: 2
				}
			]);

			setHabits(initialHabits);
			props.onHabitsCountChange(initialHabits.length);
			return () => {
				// destructor
			};
		},
		[]); // only on first render
	const onAddHabit = () => {
		setHabits([
			...habits,
			{
				habit_id: habits.length + 1,
				user_id: 0,
				description: "New habit",
				number_of_times_in_week: 0,
			},
		]);
		syncWithBackend();
	};

	const onHabitEdit = (habit: Habit) => {
		let idxHabit = habits.findIndex((h) => h.habit_id === habit.habit_id);
		if (idxHabit >= 0) {
			let newHabits = [...habits];
			newHabits[idxHabit] = habit;
			setHabits(newHabits);
		}
		syncWithBackend();
	};

	const goToScreen = (screenName: string) => {
		// eslint-disable-next-line eqeqeq
		if (route.name != screenName) {
			let state = navigation.getState();
			let index = state.routes.findIndex((r) => r.name === screenName);
			if (index >= 0) {
				navigation.popToTop({ index });
			} else {
				navigation.push(screenName);
			}
		}
	};
	const syncWithBackend = async () => {
		try {
			let habitsRequest: HabitsRequest = {
				session_token: "",
				habits,
				modified: new Date().getTime(),
			};

			// console.log(habitsRequest);
			// console.log(JSON.stringify(habitsRequest));
			const responseNative = await fetch("http://10.0.2.2:8000/habits/update", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(habitsRequest),
			});



			const data = await responseNative.json();
			console.log("responseNative");
			console.log(data);

			let response: AxiosResponse<HabitsResponse> = await axios.post(
				"http://10.0.2.2:8000/habits/update",
				habitsRequest,
				{
					headers: {
						"Content-Type": "application/json",
						responseType: "json",
					},
				},
			);

			let habitsResponse: HabitsResponse = response.data;
			console.log("responseAxios");
			console.log(habitsResponse);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<View
  style={{
				flex: 1,
				justifyContent: "flex-start",
				backgroundColor: "lightgrey",
			}}
		>
			<View style={{
				flexDirection: "column",
				gap: 20,
			}}
			>
				<Button title="Habits" onPress={() => { goToScreen("Habits"); }} />
				<Button title="Stats" onPress={() => { goToScreen("Stats"); }} />
				<Button title="Home" onPress={() => { goToScreen("TabHome"); }} />

				<Button title="Pop" onPress={() => { navigation.pop(); }} />
			</View>
			<Text
  style={{
					fontWeight: "bold",
					fontSize: 24,
					textAlign: "center",
					paddingBottom: 20,
				}}
			>
				{props.title}
			</Text>
			<ScrollView
  style={{
					backgroundColor: "white",
					flex: 1,
					marginBottom: 20,
				}}
			>
				{habits.map((habit, index) => (
					<ComponentHabit onHabitChange={onHabitEdit} key={index} habit={habit} />
				))}
			</ScrollView>
			<Button title="Add Habit" onPress={onAddHabit} />
		</View>
	);
};
