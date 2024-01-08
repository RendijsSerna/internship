import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

export default function App() {
    let [habits, setHabits] = useState<string[]>([]);
    let [newHabit, setNewHabit] = useState('');
    let [editingIndex, setEditingIndex] = useState(-1);

    const addHabit = () => {
        setHabits([...habits, newHabit]);
        setNewHabit('');
    }

    const deleteHabit = (index: number) => {
        const updatedHabits = habits.filter((_, i) => i !== index);
        setHabits(updatedHabits);
    }

    const editHabit = (index: number, newName: string) => {
        const updatedHabits = [...habits];
        updatedHabits[index] = newName;
        setHabits(updatedHabits);
        setEditingIndex(-1);
    }

    return (
        <View style={styles.container}>
            {habits.map((habit, index) => (

                <View key={index} style={styles.habitContainer}>
                    {editingIndex === index ? (
                        <TextInput
                            style={styles.input}
                            value={habit}
                            onChangeText={text => editHabit(index, text)}
                        />

                    ) : (
                        <Text style={styles.habitText}>{habit}</Text>
                    )}


                    <View style={styles.buttonContainerEdit}>
                        {editingIndex === index ? (
                            <TouchableOpacity onPress={() => editHabit(index, habit)}>
                                <Text>Save habit</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => setEditingIndex(index)}>
                                <Text>Edit habit</Text>
                            </TouchableOpacity>
                        )}
                    </View>


                    <View style={styles.buttonContainerDelete}>
                        <TouchableOpacity onPress={() => deleteHabit(index)}>
                            <Text>Delete habit</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            ))}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newHabit}
                    onChangeText={text => setNewHabit(text)}
                    placeholder="enter new habbit"
                />
            </View>

            <Button title="Add Habit" onPress={addHabit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 0,

    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        flex: 1,
    },
    buttonContainerEdit: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        backgroundColor: '#00FFFF',
        borderRadius: 5,
        padding: 5,
        marginRight: 5,
    },
    buttonContainerDelete: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        backgroundColor: '#FA8072',
        borderRadius: 5,
        padding:5,
        marginRight: 5,


    },
    habitContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        margin: 5,
    },
    habitText: {
        flex: 1,
    },
});