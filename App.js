import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Button,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

let bg_color = "sandybrown";

const pin_images = [];
pin_images[0] = require("./pics/pin1.png");
pin_images[1] = require("./pics/pin2.png");
pin_images[2] = require("./pics/pin3.png");
pin_images[3] = require("./pics/pin4.png");
pin_images[4] = require("./pics/pin6.png");
pin_images[5] = require("./pics/pin7.png");
pin_images[6] = require("./pics/pin5.png");
pin_images[7] = require("./pics/pin8.png");
pin_images[8] = require("./pics/no_response.png");

function visualize_pins(pins) {
  let pin_elements = [];
  for (let pin of pins) {
    pin_elements.push(
      <Image source={pin_images[pin]} style={styles.image_style2} />
    );
  }
  return <View style={{ flexDirection: "row" }}>{pin_elements}</View>;
}

export default function App() {
  const stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <stack.Navigator>
        <stack.Screen name="Easy Mastermind" component={Home} />
        <stack.Screen name="Game" component={Game} />
        <stack.Screen name="Settings" component={Settings} />
        <stack.Screen name="Register Player" component={Register} />
        <stack.Screen name="About" component={About} />
      </stack.Navigator>
    </NavigationContainer>
  );
}

let all_answers;

function Home({ navigation }) {
  all_answers = makeAllAnswers();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Game");
        }}
      >
        <Text style={styles.text}>Start the Game</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Settings");
        }}
      >
        <Text style={styles.text}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Register Player");
        }}
      >
        <Text style={styles.text}>Register Player</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("About");
        }}
      >
        <Text style={styles.text}>About</Text>
      </TouchableOpacity>
    </View>
  );
}

function Register({ navigation }) {
  const [text, textOnChange] = useState("");

  function checkEmail(input_email) {
    if (RegExp("@").test(input_email)) {
      Alert.alert("Thanks for registration!");
    } else {
      Alert.alert("The format of the email address is worng!");
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={{ height: 40, width: 250, borderWidth: 3, padding: 10 }}
        onChangeText={textOnChange}
        value={text}
        placeholder="Enter your email address here."
      />
      <View style={{ width: 40, height: 40 }} />
      <Button
        title="Register"
        onPress={() => {
          checkEmail(text);
        }}
      />
    </View>
  );
}

function About({ navigation }) {
  let your_name = "Emelie";

  return (
    <View style={styles.container}>
      <Text style={styles.text}>This app was completed by {your_name}</Text>
    </View>
  );
}

function Settings({ navigation }) {
  let [curr_bg_color, set_curr_bg] = useState(bg_color);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Change Game Board's Color:</Text>
      <View style={{ height: 10 }} />
      <TouchableOpacity
        onPress={() => {
          (bg_color = "sandybrown"), set_curr_bg(bg_color);
        }}
      >
        <Text style={styles.text}>Sandy Brown</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          (bg_color = "green"), set_curr_bg(bg_color);
        }}
      >
        <Text style={styles.text}>Green</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          (bg_color = "white"), set_curr_bg(bg_color);
        }}
      >
        <Text style={styles.text}>White</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          (bg_color = "red"), set_curr_bg(bg_color);
        }}
      >
        <Text style={styles.text}>Red</Text>
      </TouchableOpacity>
      <View style={{ height: 30 }} />
      <Text style={styles.text}>Selected Color:</Text>
      <View
        style={{
          width: 30,
          height: 30,
          backgroundColor: curr_bg_color,
          borderWidth: 3,
        }}
      />
    </View>
  );
}

function makeAllAnswers() {
  let allAnswers = [];

  for (let i = 0; i < 6; i++)
    for (let j = 0; j < 6; j++)
      if (i != j)
        for (let k = 0; k < 6; k++)
          if (k != i && k != j)
            for (let l = 0; l < 6; l++)
              if (l != i && l != j && l != k) allAnswers.push([i, j, k, l]);

  return allAnswers;
}

function Game({ navigation }) {
  const [history, setHistory] = useState([]);
  const [currPins, setCurrPins] = useState([...all_answers[0]]);
  const [responses, setResponses] = useState([]);

  function resetFunc() {
    all_answers = makeAllAnswers();
    setResponses([]);
    setHistory([]);
    setCurrPins([...all_answers[0]]);
  }

  function click(response_button) {
    let pin_position = responses.length;
    let curr_pin = currPins[pin_position];
    let curr_responses = [...responses, response_button];

    if (response_button == 6) {
      //white pin
      all_answers = all_answers.filter((obj) => obj.includes(curr_pin));
    } else if (response_button == 7) {
      //black pin
      all_answers = all_answers.filter((obj) => obj[pin_position] == curr_pin);
    } else if (response_button == 8) {
      //no response
      all_answers = all_answers.filter((obj) => !obj.includes(curr_pin));
    }

    if (all_answers.length == 0) {
      Alert.alert("That's impossible!");
      resetFunc();
    } else if (curr_responses.length == 4) {
      setHistory([
        { currPins: [...currPins], responses: [...curr_responses] },
        ...history,
      ]);
      if (curr_responses.every((obj) => obj == 7) && all_answers.length == 1) {
        Alert.alert("I found the solution baby!!");
        resetFunc();
      } else {
        all_answers.shift();
        setCurrPins([...all_answers[0]]);
        setResponses([]);
      }
    } else {
      setResponses(curr_responses);
    }
  }

  return (
    <View style={{ backgroundColor: bg_color, flex: 1 }}>
      <View style={{ flexDirection: "row", flex: 1 }}>
        <View style={{ flex: 3 }}>
          <View style={{ flex: 0.15 }}>
            <Text>Current Selection</Text>
            <FlatList
              data={currPins}
              horizontal={true}
              renderItem={({ item }) => (
                <Image source={pin_images[item]} style={styles.image_style2} />
              )}
            />
          </View>
          <View style={{ flex: 0.15 }}>
            <Text>Responses</Text>
            <FlatList
              data={responses}
              horizontal={true}
              renderItem={({ item }) => (
                <Image source={pin_images[item]} style={styles.image_style2} />
              )}
            />
          </View>
          <View style={{ flex: 0.7 }}>
            <Text>Game History</Text>
            <FlatList
              style={{ flex: 1 }}
              data={history}
              renderItem={({ item }) => {
                return (
                  <View>
                    <View style={{ backgroundColor: "black", height: 5 }} />
                    {visualize_pins(item.currPins)}
                    <View style={{ backgroundColor: "white", height: 1 }} />
                    {visualize_pins(item.responses)}
                  </View>
                );
              }}
            />
          </View>
        </View>
        <View style={{ flex: 2, backgroundColor: "green" }}>
          <Image
            source={require("./pics/mastermind.png")}
            style={{ resizeMode: "stretch", flex: 1, width: "auto" }}
          />
        </View>
      </View>
      <View style={{ flex: 0.1, flexDirection: "row" }}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{ flex: 1 }}
          onPress={() => {
            click(6);
          }}
        >
          <Image source={pin_images[6]} style={styles.image_style1} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{ flex: 1 }}
          onPress={() => {
            click(7);
          }}
        >
          <Image source={pin_images[7]} style={styles.image_style1} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{ flex: 1 }}
          onPress={() => {
            click(8);
          }}
        >
          <Image source={pin_images[8]} style={styles.image_style1} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "sandybrown",
  },
  full_row_style: {
    flexDirection: "row",
    flex: 0.07,
  },
  image_style1: {
    flex: 1,
    resizeMode: "stretch",
    width: "auto",
  },
  image_style2: {
    resizeMode: "stretch",
    width: 58,
    height: 58,
  },
});
