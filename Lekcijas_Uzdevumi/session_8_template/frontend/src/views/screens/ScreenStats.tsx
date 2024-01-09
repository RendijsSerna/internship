import { Text, View } from "react-native";
import { Slider } from "@rneui/base";
import { useState } from "react";
import { Rating } from "@rneui/themed";
import { isNumber } from "lodash";

interface Props {
  countHabits: number;

}
export const ScreenStats = ({ countHabits }: Props) => (
  const [rating, setRating] = useState(0);

<View>
  <Slider value={rating} onValueChange={setRating} maximumValue={10} minimumValue={0} />
  <Rating showRating={true} onFinishRating={{value: number}}
    <Text>{countHabits}</Text>
</View>
);
