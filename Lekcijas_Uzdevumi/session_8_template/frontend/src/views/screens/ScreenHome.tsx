import { Dimensions, Image, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocalizedStrings from "react-native-localization";
import SvgRobot from "../../recourses/svg/svgRobot";
import { VictoryChart, VictoryLabel, VictoryLine } from "victory-native";

const strings = new LocalizedStrings({
  "en":{
    home_button_add_habbit:"Add Habit",
    home_lang: "Choose lang"
  },
  "lv":{
    home_button_add_habbit:"pievienot paradumu",
    home_lang: "Valodas izvele "
  }

});

interface Props{

}
interface Record {
  day: number;
  count: number;
}
export const ScreenHome = (props: Props) => {
  const [language, setLanguage] = useState("en");

  const [records, setRecords] =useState<Record[]>([
    {day:1 , count:0},
    {day:2 , count:2},
    {day:3 , count:5},
    {day:4 , count:3}
  ])

  const init = async () => {
    const language = await AsyncStorage.getItem("language");
    if(language){
      await onLanguageChange(language)
    }

  };
  const onLanguageChange = async (language: string) => {
    await AsyncStorage.setItem("language", language);
    strings.setLanguage(language);
    setLanguage(language);
  };
  const destroy = async () => {


  };

  const dim = Dimensions.get("screen")

  useEffect(() => {
     init();
    return () => {destroy()};
},[]);


  return     <View style={{padding: 20}}>
    <Text>{strings.home_lang}</Text>
    <Picker onValueChange={onLanguageChange} selectedValue={language}>
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Latvian" value="lv" />
      <Picker.Item label="Russian" value="rus" />
      <Picker.Item label="French" value="fre" />


    </Picker>

    <Image
      style={{
        width: dim.width - 40,
        height: 200,
        resizeMode: "contain",
        backgroundColor: "gray",

      }}

      source={require("../../recourses/images/robot.png")}/>
    <SvgRobot width={dim.width - 40} height={200}/>
    <VictoryChart
      width={dim.width}
      height={200}>
      <VictoryLine style={{
        data: {stroke: "red"},
        parent: {border: "1px "}
      }} interpolation={"natural"} label={"Habits"} data={records} x={"day"} y={"count"} />

    </VictoryChart>
  </View>;

};
