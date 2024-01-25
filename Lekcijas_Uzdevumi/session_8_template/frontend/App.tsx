/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from "react";
import {
	Button,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	useColorScheme,
	View,
} from "react-native";

import {
	Colors,
	DebugInstructions,
	Header,
	LearnMoreLinks,
	ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";
import { ScreenHabits } from "./src/views/screens/ScreenHabits";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { name } from "axios";
import { ScreenHome } from "./src/views/screens/ScreenHome";
import { ScreenStats } from "./src/views/screens/ScreenStats";


const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function App(): React.JSX.Element {
		const [countHabits, setCountHabits] = useState(0);

	return <NavigationContainer>
		<Tabs.Navigator>
			<Tabs.Screen name={"TabHome"} component={ScreenHome} options={{headerShown: false}}></Tabs.Screen>
			<Tabs.Screen name={"Habits"} options={{headerShown: false}} children={() => (
				<Stack.Navigator initialRouteName={"Habits"}>
					<Stack.Screen name={"Habits"} children={()=> <ScreenHabits title={"Habits"} onHabitsCountChange={setCountHabits}/> }/>
					<Stack.Screen name={"Stats"} children={()=> <ScreenStats countHabits={countHabits} countHabitsCompleted={0} countHabitsNotCompleted={0} /> }/>

					</Stack.Navigator>
			)} />


		</Tabs.Navigator>
	</NavigationContainer>
	return <ScreenHabits title={"Habits"} />;
}

const styles = StyleSheet.create({
	sectionContainer: {
		marginTop: 32,
		paddingHorizontal: 24,
	},
});

export default App;
