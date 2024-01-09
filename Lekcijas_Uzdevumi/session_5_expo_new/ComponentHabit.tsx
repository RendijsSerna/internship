import { StatusBar } from 'expo-status-bar';
import {Button, StyleSheet, Text, View} from 'react-native';
import {useEffect, useState} from "react";


interface Props{
    id: number;
    name:string
}
export const ComponentHabit = (props : Props) => {
    return <View>
        <Text>habbit: {props.name}</Text>
    </View>
}