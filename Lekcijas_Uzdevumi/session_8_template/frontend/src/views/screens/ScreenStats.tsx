import { Alert, Button, Text, View } from "react-native";
import { Slider } from "@rneui/base";
import { useState } from "react";
import { Rating } from "@rneui/themed";
import { isNumber, values } from "lodash";


interface Props {
  countHabits: number;
  countHabitsCompleted: number;
  countHabitsNotCompleted: number;

}
export const ScreenStats = ({ countHabits }: Props) => {
  const [rating, setRating] = useState(0);
  return (
    <View>
      <Slider value={rating} onValueChange={setRating} maximumValue={10} minimumValue={0} />
      <Rating
        showRating
        onFinishRating={(value: number) => {
          setRating(value);
        }}
      />
      <Button
        title={"RNEUI Button"}
        buttonStyle={{ backgroundColor: "rgba(39,39,39,1)" }}
        containerStyle={{
                width: 200,
                marginHorizontal: 50,
                marginVertical: 10,
              }}
        titleStyle={{ color: "white", marginHorizontal: 20 }}
        onPress={() => {
                Alert.alert("Button Pressed");
              }}
      />
      <Text>{`Rating: ${rating}`}</Text>
      <Text>{`Number of habits: ${countHabits}`}</Text>
    </View>

  );
};
