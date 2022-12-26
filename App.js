import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import * as React from "react";
import { Component } from "react";
import { StyleSheet, View, useColorScheme, ScrollView, Linking, Vibration } from "react-native";
import { Text, Appbar, Button, MD3DarkTheme, MD3LightTheme, Provider as PaperProvider, adaptNavigationTheme, Surface, DataTable, ActivityIndicator } from "react-native-paper";
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import HtmlText from "react-native-html-to-text";

const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
const dayOfWeek = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];

const Tab = createMaterialBottomTabNavigator();

const Stack = createNativeStackNavigator();

const { LightTheme, DarkTheme } = adaptNavigationTheme({
	light: NavigationDefaultTheme,
	dark: NavigationDarkTheme
});

const lightTheme = {
	...MD3LightTheme,
	...LightTheme,
	colors: {
		...MD3LightTheme.colors,
		...LightTheme.colors
	}
};
const darkTheme = {
	...MD3DarkTheme,
	...DarkTheme,
	colors: {
		...MD3DarkTheme.colors,
		...DarkTheme.colors
	}
};

const BellSchedule = () => {
	const scheme = useColorScheme();
	return (
		<PaperProvider theme={scheme == "light" ? lightTheme : darkTheme}>
			<View>
				<ExpoStatusBar style={scheme == "light" ? "dark" : "light"} />
				<ScrollView style={styles.main} contentContainerStyle={{ paddingHorizontal: 4 }}>
					<Text variant="titleLarge">Regular (Mon, Wed, Thu, Fri)</Text>
					<DataTable style={{ marginBottom: 50 }}>
						<DataTable.Row>
							<DataTable.Cell>Warning Bell</DataTable.Cell>
							<DataTable.Cell>8:25 am</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>First Block</DataTable.Cell>
							<DataTable.Cell>8:30 - 9:50am</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Second Block</DataTable.Cell>
							<DataTable.Cell>9:55 - 11:20am</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Lunch Break</DataTable.Cell>
							<DataTable.Cell>11:20 - 12:00pm</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Third Block</DataTable.Cell>
							<DataTable.Cell>12:05 - 1:30pm</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Fourth Block</DataTable.Cell>
							<DataTable.Cell>1:35 - 2:55pm</DataTable.Cell>
						</DataTable.Row>
					</DataTable>
					<Text variant="titleLarge">Tuesday Late Start</Text>
					<DataTable style={{ marginBottom: 50 }}>
						<DataTable.Row>
							<DataTable.Cell>Warning Bell</DataTable.Cell>
							<DataTable.Cell>9:15 am</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>First Block</DataTable.Cell>
							<DataTable.Cell>9:20 - 10:30am</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Second Block</DataTable.Cell>
							<DataTable.Cell>10:35 - 11:45am</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Lunch Break</DataTable.Cell>
							<DataTable.Cell>11:45 - 12:25pm</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Third Block</DataTable.Cell>
							<DataTable.Cell>12:30 - 1:40pm</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Fourth Block</DataTable.Cell>
							<DataTable.Cell>1:45 - 2:55pm</DataTable.Cell>
						</DataTable.Row>
					</DataTable>

					<Text variant="titleLarge">Early Dismissal</Text>
					<DataTable style={{ marginBottom: 50 }}>
						<DataTable.Row>
							<DataTable.Cell>Warning Bell</DataTable.Cell>
							<DataTable.Cell>8:25 am</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>First Block</DataTable.Cell>
							<DataTable.Cell>8:30 - 9:40am</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Second Block</DataTable.Cell>
							<DataTable.Cell>9:45 - 10:55am</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Lunch Break</DataTable.Cell>
							<DataTable.Cell>10:55 - 11:35pm</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Third Block</DataTable.Cell>
							<DataTable.Cell>11:40 - 12:50pm</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Fourth Block</DataTable.Cell>
							<DataTable.Cell>12:55 - 2:05pm</DataTable.Cell>
						</DataTable.Row>
					</DataTable>

					<Text variant="titleLarge">Block Rotation</Text>
					<DataTable style={{ marginBottom: 50 }}>
						<DataTable.Row>
							<DataTable.Cell>Week 1 & 2</DataTable.Cell>
							<DataTable.Cell>ABCD/EFGH</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Week 3 & 4</DataTable.Cell>
							<DataTable.Cell>CDAB/GHEF</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Week 5 & 6</DataTable.Cell>
							<DataTable.Cell>BADC/FEHG</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Week 7 & 8</DataTable.Cell>
							<DataTable.Cell>DCBA/HGFE</DataTable.Cell>
						</DataTable.Row>
					</DataTable>
				</ScrollView>
			</View>
		</PaperProvider>
	);
};

const HomeRoute = ({ navigation }) => {
	const scheme = useColorScheme();

	return (
		<View style={{ height: "100%" }}>
			<Appbar.Header mode="small" elevated="true">
				<Text variant="headlineLarge" style={{ marginLeft: 25 }}>
					Home
				</Text>
			</Appbar.Header>
			<ScrollView style={styles.main}>
				{/* <Text variant="headlineSmall">Block rotation</Text> */}
				<Surface style={styles.section} elevation={2}>
					<Text variant="titleMedium">ABCD</Text>
					<Text variant="titleMedium">Day 1</Text>
					<View style={styles.line}></View>
				</Surface>
				<Text variant="headlineSmall">Information</Text>
				<Surface style={styles.info_section} elevation={2}>
					<View>
						<Text variant="titleMedium">Bell schedule</Text>
					</View>
					<Button
						mode="contained"
						onPress={() => {
							Vibration.vibrate(5);
							navigation.navigate("Bell Schedule");
						}}
					>
						View
					</Button>
				</Surface>
				<Surface style={styles.info_section} elevation={2}>
					<View>
						<Text variant="titleMedium">Website</Text>
					</View>
					<Button
						mode="contained"
						onPress={() => {
							Vibration.vibrate(5);
							Linking.openURL("https://www.surreyschools.ca/johnht");
						}}
					>
						Visit
					</Button>
				</Surface>
			</ScrollView>
		</View>
	);
};

const MessagesRoute = ({ navigation }) => {
	const scheme = useColorScheme();
	return (
		<Appbar.Header mode="small" elevated="true">
			<Text variant="headlineLarge" style={{ marginLeft: 25 }}>
				Messages
			</Text>
		</Appbar.Header>
	);
};

class CalendarRoute extends Component {
	constructor() {
		super();
		this.state = {
			eventList: []
		};
		fetch("https://eagletime.fly.dev/calendar")
			.then((response) => response.json())
			.catch((error) => console.error(error))
			.then((events) => {
				this.setState({
					eventList: events
				});
			});
	}
	render() {
		var appendedDates = [];
		let events = this.state.eventList.map((a, i) => {
			if (!appendedDates.includes(a.date)) {
				appendedDates.push(a.date);
				let date = new Date(a.date);
				let formattedDate = dayOfWeek[date.getDay()] + " " + months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
				return (
					<View>
						<Text key={a.date} variant="titleMedium" style={{ marginTop: 20 }}>
							{formattedDate}
						</Text>
						<Surface key={i} style={styles.info_section} elevation={2}>
							<View>
								<Text variant="titleLarge">{a.name}</Text>
								<HtmlText style={{ color: "white" }} html={a.description}></HtmlText>
							</View>
						</Surface>
					</View>
				);
			} else {
				return (
					<View>
						<Surface key={i} style={styles.info_section} elevation={2}>
							<View>
								<Text variant="titleLarge">{a.name}</Text>
								<HtmlText style={{ color: "white" }} html={a.description}></HtmlText>
							</View>
						</Surface>
					</View>
				);
			}
		});
		return (
			<View style={{ height: "100%" }}>
				<Appbar.Header mode="small" elevated="true">
					<Text variant="headlineLarge" style={{ marginLeft: 25 }}>
						Calendar
					</Text>
				</Appbar.Header>
				<ScrollView style={styles.main}>
					{events}
					<ActivityIndicator animating={true} size={"small"} style={{ marginTop: 20 }} />
				</ScrollView>
			</View>
		);
	}
}

const MainScreen = () => {
	const scheme = useColorScheme();
	return (
		<PaperProvider theme={scheme == "light" ? lightTheme : darkTheme}>
			<View>
				<ExpoStatusBar style={scheme == "light" ? "dark" : "light"} />
			</View>
			<Tab.Navigator shifting={false}>
				<Tab.Screen
					name="Home"
					component={HomeRoute}
					options={{
						tabBarIcon: ({ focused, color }) => (focused ? <MaterialCommunityIcons name="home" color={color} size={24} /> : <MaterialCommunityIcons name="home-outline" color={color} size={24} />)
					}}
					listeners={() => ({
						tabPress: (e) => {
							Vibration.vibrate(5);
						}
					})}
				/>
				<Tab.Screen
					name="Messages"
					component={MessagesRoute}
					options={{
						tabBarIcon: ({ focused, color }) => (focused ? <MaterialCommunityIcons name="bell" color={color} size={24} /> : <MaterialCommunityIcons name="bell-outline" color={color} size={24} />)
					}}
					listeners={() => ({
						tabPress: (e) => {
							Vibration.vibrate(5);
						}
					})}
				/>
				<Tab.Screen
					name="Calendar"
					component={CalendarRoute}
					options={{
						tabBarIcon: ({ focused, color }) => (focused ? <MaterialCommunityIcons name="calendar" color={color} size={24} /> : <MaterialCommunityIcons name="calendar-outline" color={color} size={24} />)
					}}
					listeners={() => ({
						tabPress: (e) => {
							Vibration.vibrate(5);
						}
					})}
				/>
			</Tab.Navigator>
		</PaperProvider>
	);
};

const TopNavBar = ({ navigation, route, options, back }) => {
	const scheme = useColorScheme();
	if (route.name != "Main") {
		return (
			<Appbar.Header mode="small" elevated="true" theme={scheme == "light" ? lightTheme : darkTheme}>
				{back ? <Appbar.BackAction onPress={navigation.goBack} color={scheme == "light" ? lightTheme.colors.text : darkTheme.colors.text} /> : null}
				<Text variant="headlineLarge" style={{ marginLeft: 25 }} theme={scheme == "light" ? lightTheme : darkTheme}>
					{route.name}
				</Text>
			</Appbar.Header>
		);
	}
};

export default function App() {
	const scheme = useColorScheme();
	return (
		<NavigationContainer theme={scheme == "light" ? lightTheme : darkTheme}>
			<Stack.Navigator
				screenOptions={{
					header: (props) => <TopNavBar {...props} />
				}}
			>
				<Stack.Screen name="Main" component={MainScreen} />
				<Stack.Screen name="Bell Schedule" component={BellSchedule} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	section: {
		padding: 25,
		borderRadius: 20,
		marginTop: 10,
		marginBottom: 25
	},
	info_section: {
		padding: 25,
		borderRadius: 20,
		marginTop: 10,
		marginBottom: 10,
		flexDirection: "row",
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center"
	},
	main: {
		padding: 25
	},
	line: {
		borderBottomColor: "#888",
		borderBottomWidth: StyleSheet.hairlineWidth,
		alignSelf: "stretch",
		width: "100%",
		marginVertical: 25
	}
});
