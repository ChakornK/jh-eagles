import * as React from "react";
import { Component } from "react";
import { StatusBar, StyleSheet, View, ScrollView, Linking, Vibration, useColorScheme, Appearance } from "react-native";
import { Text, Appbar, Button, MD3DarkTheme, MD3LightTheme, Provider as PaperProvider, adaptNavigationTheme, Surface, DataTable, ActivityIndicator, AnimatedFAB, Portal, Dialog, Snackbar } from "react-native-paper";
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createMaterialBottomTabNavigator } from "@juliushuck/react-native-navigation-material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import HtmlText from "react-native-html-to-text";
import DatePicker from "react-native-modern-datepicker";

const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
const dayOfWeek = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];

const Tab = createMaterialBottomTabNavigator();

const Stack = createNativeStackNavigator();

// console.log(MD3DarkTheme);

const BellSchedule = () => {
	const scheme = useColorScheme();
	return (
		<PaperProvider theme={scheme == "light" ? MD3LightTheme : MD3DarkTheme}>
			<View>
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
	// const scheme = useColorScheme();

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
				<Surface style={styles.info_section} elevation={2}>
					<View>
						<Text variant="titleMedium">MyEdBC</Text>
					</View>
					<Button
						mode="contained"
						onPress={() => {
							Vibration.vibrate(5);
							Linking.openURL("https://myeducation.gov.bc.ca/aspen/logon.do");
						}}
					>
						Visit
					</Button>
				</Surface>
				<Surface style={styles.info_section} elevation={2}>
					<View>
						<Text variant="titleMedium">School Cash Online</Text>
					</View>
					<Button
						mode="contained"
						onPress={() => {
							Vibration.vibrate(5);
							Linking.openURL("https://www.schoolcashonline.com/");
						}}
					>
						Visit
					</Button>
				</Surface>
				<Surface style={styles.info_section} elevation={2}>
					<View>
						<Text variant="titleMedium">Counsellor Appointments</Text>
					</View>
					<Button
						mode="contained"
						onPress={() => {
							Vibration.vibrate(5);
							Linking.openURL("https://jh.counsellorappointments.com/");
						}}
					>
						Visit
					</Button>
				</Surface>
				<Surface style={styles.info_section} elevation={2}>
					<View>
						<Text variant="titleMedium">Locker Assignments</Text>
					</View>
					<Button
						mode="contained"
						onPress={() => {
							Vibration.vibrate(5);
							Linking.openURL("https://jh.lockerassignment.com/");
						}}
					>
						Visit
					</Button>
				</Surface>
				<Surface style={styles.info_section} elevation={2}>
					<View>
						<Text variant="titleMedium">School Map</Text>
					</View>
					<Button
						mode="contained"
						onPress={() => {
							Vibration.vibrate(5);
							Linking.openURL("https://eagletime.appazur.com/media/info/eagletime/map_JH_2019_.jpg_CvI94vg.png");
						}}
					>
						Visit
					</Button>
				</Surface>
				<Surface style={styles.info_section} elevation={2}>
					<View>
						<Text variant="titleMedium">Phone</Text>
					</View>
					<Button
						mode="contained"
						onPress={() => {
							Vibration.vibrate(5);
							Linking.openURL("tel:+16045815500");
						}}
					>
						Visit
					</Button>
				</Surface>
				<Surface style={styles.info_section} elevation={2}>
					<View>
						<Text variant="titleMedium">Map and Directions</Text>
					</View>
					<Button
						mode="contained"
						onPress={() => {
							Vibration.vibrate(5);
							Linking.openURL("https://goo.gl/maps/K8cF7KdCun4r6RV89");
						}}
					>
						Visit
					</Button>
				</Surface>
				<View style={styles.main}></View>
			</ScrollView>
		</View>
	);
};

const MessagesRoute = ({ navigation }) => {
	// const scheme = useColorScheme();
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
			eventList: [],
			fabExtended: true,
			calendarVisible: false,
			lastRefresh: Date(Date.now()).toString(),
			minDate: "",
			maxDate: "",
			selectedDate: "",
			datePositions: {},
			snackbarVisible: false
		};
		fetch("https://eagletime.fly.dev/calendar")
			.then((response) => response.json())
			.catch((error) => console.error(error))
			.then((events) => {
				this.setState({
					eventList: events,
					minDate: events[0].date,
					maxDate: events[events.length - 1].date
				});
			});

		this.refreshScreen = this.refreshScreen.bind(this);
	}
	refreshScreen() {
		this.setState({ lastRefresh: Date(Date.now()).toString() });
	}
	render() {
		Appearance.addChangeListener(() => {
			this.refreshScreen();
		});
		var appendedDates = [];

		var events = this.state.eventList.map((a, i) => {
			if (!appendedDates.includes(a.date)) {
				appendedDates.push(a.date);
				let date = new Date(a.date);
				date.setUTCHours(16);
				let formattedDate = dayOfWeek[date.getDay()] + " " + months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
				if (a.cal_mode === 1) {
					return (
						<View
							key={a.date}
							style={styles.events}
							onLayout={(event) => {
								this.state.datePositions[a.date] = Math.floor(event.nativeEvent.layout.y);
							}}
						>
							{appendedDates.length > 1 ? <View style={styles.line}></View> : null}

							<Text variant="titleMedium" style={{ marginTop: 20 }}>
								{formattedDate} — <Text variant="titleLarge">{a.name}</Text>
							</Text>
						</View>
					);
				} else {
					return (
						<View
							key={i}
							style={styles.events}
							onLayout={(event) => {
								if (!this.state.datePositions[a.date]) {
									this.state.datePositions[a.date] = Math.floor(event.nativeEvent.layout.y);
								}
							}}
						>
							<Text variant="titleMedium" style={{ marginTop: 20 }}>
								{formattedDate}
							</Text>
							<Surface style={styles.info_section} elevation={2}>
								<View>
									<Text style={styles.text_with_margin} variant="titleLarge">
										{a.name}
									</Text>
									{a.start ? (
										a.end ? (
											<Text style={styles.text_with_margin} variant="titleMedium">
												{a.start} - {a.end}
											</Text>
										) : (
											<Text style={styles.text_with_margin} variant="titleMedium">
												{a.start}
											</Text>
										)
									) : (
										<View style={styles.text_with_margin}></View>
									)}
									{a.description ? <HtmlText html={a.description}></HtmlText> : null}
								</View>
							</Surface>
						</View>
					);
				}
			} else {
				return (
					<View key={i} style={styles.events}>
						<Surface style={styles.info_section} elevation={2}>
							<View>
								<Text variant="titleLarge">{a.name}</Text>
								{a.start ? (
									a.end ? (
										<Text style={styles.text_with_margin} variant="titleMedium">
											{a.start} - {a.end}
										</Text>
									) : (
										<Text style={styles.text_with_margin} variant="titleMedium">
											{a.start}
										</Text>
									)
								) : (
									<View style={styles.text_with_margin}></View>
								)}
								{a.description ? <HtmlText html={a.description}></HtmlText> : null}
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
				<Portal>
					<Dialog dismissable={true} visible={this.state.calendarVisible} onDismiss={() => this.setState({ calendarVisible: false })}>
						<Dialog.Title>Pick a date</Dialog.Title>
						<Dialog.Content>
							<DatePicker
								mode="calendar"
								options={
									Appearance.getColorScheme() == "light"
										? {
												backgroundColor: MD3LightTheme.colors.elevation.level3,
												textHeaderColor: MD3LightTheme.colors.onSurface, // Month and year text
												textDefaultColor: MD3LightTheme.colors.onSurface, // Day text
												selectedTextColor: MD3LightTheme.colors.onPrimary, // Day text when selected
												mainColor: MD3LightTheme.colors.primary, // accent color (arrows and selected bubble)
												textSecondaryColor: MD3LightTheme.colors.onSurfaceDisabled, // days of week label
												borderColor: "#00000000"
										  }
										: {
												backgroundColor: MD3DarkTheme.colors.elevation.level3,
												textHeaderColor: MD3DarkTheme.colors.onSurface, // Month and year text
												textDefaultColor: MD3DarkTheme.colors.onSurface, // Day text
												selectedTextColor: MD3DarkTheme.colors.onPrimary, // Day text when selected
												mainColor: MD3DarkTheme.colors.primary, // accent color (arrows and selected bubble)
												textSecondaryColor: MD3DarkTheme.colors.onSurfaceDisabled, // days of week label
												borderColor: "#ffffff00"
										  }
								}
								minimumDate={this.state.minDate}
								maximumDate={this.state.maxDate}
								onDateChange={(date) => {
									this.setState({
										selectedDate: date.replace(/\//g, "-")
									});
								}}
							/>
						</Dialog.Content>
						<Dialog.Actions>
							<Button onPress={() => this.setState({ calendarVisible: false })}>Cancel</Button>
							<Button
								onPress={() => {
									this.setState({ calendarVisible: false });
									if (this.state.datePositions[this.state.selectedDate]) {
										this.scrollViewElement.scrollTo({ x: 0, y: this.state.datePositions[this.state.selectedDate], animated: true });
									} else {
										this.setState({ snackbarVisible: true });
										setTimeout(() => {
											this.setState({ snackbarVisible: false });
										}, 2000);
									}
								}}
							>
								Ok
							</Button>
						</Dialog.Actions>
					</Dialog>
				</Portal>
				<Snackbar
					visible={this.state.snackbarVisible}
					onDismiss={() => {
						this.setState({ snackbarVisible: false });
					}}
					action={{
						label: "Dismiss",
						onPress: () => {
							this.setState({ snackbarVisible: false });
						}
					}}
					style={{
						zIndex: 99999
					}}
					theme={MD3DarkTheme}
				>
					Selected date is not on the calendar.
				</Snackbar>
				<AnimatedFAB
					icon={"calendar"}
					label={"Calendar view"}
					extended={this.state.fabExtended}
					onPress={() => this.setState({ calendarVisible: true, selectedDate: "" })}
					visible={true}
					animateFrom={"right"}
					iconMode={"dynamic"}
					style={{
						bottom: this.state.snackbarVisible ? 64 : 16,
						right: 16,
						position: "absolute",
						zIndex: 9999
					}}
				/>
				<ScrollView
					style={styles.scrollview}
					onScroll={(e) => {
						if (e.nativeEvent.contentOffset.y > 100) {
							this.setState({ fabExtended: false });
						} else {
							this.setState({ fabExtended: true });
						}
					}}
					ref={(ref) => (this.scrollViewElement = ref)}
				>
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
		<PaperProvider theme={scheme == "light" ? MD3LightTheme : MD3DarkTheme}>
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
			<Appbar.Header mode="small" elevated="true" theme={scheme == "light" ? MD3LightTheme : MD3DarkTheme}>
				{back ? <Appbar.BackAction onPress={navigation.goBack} color={scheme == "light" ? MD3LightTheme.colors.onSurface : MD3DarkTheme.colors.onSurface} /> : null}
				<Text variant="headlineLarge" style={{ marginLeft: 25 }} theme={scheme == "light" ? MD3LightTheme : MD3DarkTheme}>
					{route.name}
				</Text>
			</Appbar.Header>
		);
	}
};

export default function App() {
	const scheme = useColorScheme();
	return (
		<NavigationContainer theme={scheme == "light" ? MD3LightTheme : MD3DarkTheme}>
			<StatusBar barStyle={scheme == "light" ? "dark-content" : "light-content"} backgroundColor="#00000000" translucent={true} />
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
	},
	events: {
		paddingHorizontal: 25
	},
	scrollview: {
		paddingVertical: 25
	},
	text_with_margin: {
		marginBottom: 10
	}
});
