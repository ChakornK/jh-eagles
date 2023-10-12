import "react-native-gesture-handler";

import * as React from "react";
import { Component } from "react";
import { StatusBar, StyleSheet, View, ScrollView, Linking, Vibration, useColorScheme, Image, FlatList, Pressable } from "react-native";
import { Text, Appbar, Button, MD3DarkTheme as DefaultDarkTheme, MD3LightTheme as DefaultLightTheme, Provider as PaperProvider, Surface, DataTable, ActivityIndicator, AnimatedFAB, Portal, Dialog, Snackbar, TouchableRipple, RadioButton, TextInput, IconButton } from "react-native-paper";
import { NavigationContainer, useIsFocused } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@juliushuck/react-native-navigation-material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import HtmlText from "react-native-html-to-text-updated";
import DatePicker from "react-native-modern-datepicker";
import { WebView } from "react-native-webview";
import ImageView from "react-native-image-viewing";
import createDynamicThemeColors from "./createMaterialYouPalette.js";
import ColorPicker from "react-native-wheel-color-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as schoolMap from "./assets/schoolmap.js";

const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
const dayOfWeek = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];

// const weatherIcons = {
// 	"clear-day": "weather-sunny",
// 	"clear-night": "weather-night",
// 	rain: "weather-rainy",
// 	snow: "weather-snowy-heavy",
// 	sleet: "weather-snowy-rainy",
// 	wind: "weather-windy",
// 	fog: "weather-fog",
// 	cloudy: "weather-cloudy",
// 	"partly-cloudy-day": "weather-partly-cloudy",
// 	"partly-cloudy-night": "weather-night-partly-cloudy",
// 	hail: "weather-hail",
// 	thunderstorm: "weather-lightning",
// 	tornado: "weather-tornado",
// 	unknown: "help"
// };

const weatherIcons = {
	"01d": "weather-sunny",
	"02d": "weather-partly-cloudy",
	"03d": "weather-cloudy",
	"04d": "weather-cloudy",
	"09d": "weather-rainy",
	"10d": "weather-pouring",
	"11d": "weather-lightning",
	"13d": "weather-snowy-heavy",
	"50d": "weather-fog",

	"01n": "weather-night",
	"02n": "weather-night-partly-cloudy",
	"03n": "weather-cloudy",
	"04n": "weather-cloudy",
	"09n": "weather-rainy",
	"10n": "weather-pouring",
	"11n": "weather-lightning",
	"13n": "weather-snowy-heavy",
	"50n": "weather-fog"
};

var MD3DarkTheme = {
	...DefaultDarkTheme
};
var MD3LightTheme = {
	...DefaultLightTheme
};
function generateColorPalette(color, theme) {
	var materialYouPalette = createDynamicThemeColors({
		sourceColor: color
	});
	if (theme == "light") {
		MD3DarkTheme = {
			...DefaultLightTheme,
			colors: {
				...DefaultLightTheme.colors,
				...materialYouPalette.light
			}
		};
		MD3LightTheme = {
			...DefaultLightTheme,
			colors: {
				...DefaultLightTheme.colors,
				...materialYouPalette.light
			}
		};
	} else if (theme == "dark") {
		MD3DarkTheme = {
			...DefaultDarkTheme,
			colors: {
				...DefaultDarkTheme.colors,
				...materialYouPalette.dark
			}
		};
		MD3LightTheme = {
			...DefaultDarkTheme,
			colors: {
				...DefaultDarkTheme.colors,
				...materialYouPalette.dark
			}
		};
	} else {
		MD3DarkTheme = {
			...DefaultDarkTheme,
			colors: {
				...DefaultDarkTheme.colors,
				...materialYouPalette.dark
			}
		};
		MD3LightTheme = {
			...DefaultLightTheme,
			colors: {
				...DefaultLightTheme.colors,
				...materialYouPalette.light
			}
		};
	}
}
var accentColor, theme;
async function reloadColorPalette() {
	accentColor = await getData("accentColor");
	theme = await getData("theme");
	if (!accentColor) {
		storeData("accentColor", "#4285F4");
		accentColor = await getData("accentColor");
	}
	if (!theme) {
		storeData("theme", "auto");
		theme = await getData("theme");
	}
	generateColorPalette(accentColor, theme);
	topBarNotThemed = true;
	appParentNotThemed = true;
	settingsNotThemed = true;
	assignmentsNotThemed = true;
	homeNotThemed = true;
	setTimeout(() => {
		topBarNotThemed = true;
		appParentNotThemed = true;
		settingsNotThemed = true;
		assignmentsNotThemed = true;
		homeNotThemed = true;
	}, 1500);
}
const storeData = async (key, value) => {
	try {
		await AsyncStorage.setItem(key, value);
		return true;
	} catch (e) {
		return false;
	}
};
const getData = async (key) => {
	try {
		const value = await AsyncStorage.getItem(key);
		return value;
	} catch (e) {
		return null;
	}
};
const storeJsonData = async (key, value) => {
	try {
		await AsyncStorage.setItem(key, JSON.stringify(value));
		return true;
	} catch (e) {
		return false;
	}
};
const getJsonData = async (key) => {
	try {
		const value = await AsyncStorage.getItem(key);
		return JSON.parse(value);
	} catch (e) {
		return null;
	}
};

(async function () {
	accentColor = await getData("accentColor");
	theme = await getData("theme");
	if (!accentColor) {
		storeData("accentColor", "#4285F4");
		accentColor = await getData("accentColor");
	}
	if (!theme) {
		storeData("theme", "auto");
		theme = await getData("theme");
	}
	generateColorPalette(accentColor, theme);
})();

var assignmentsStore;
(async function () {
	assignmentsStore = await getJsonData("assignments");
	if (!assignmentsStore) {
		storeJsonData("assignments", []);
		assignmentsStore = [];
	}
})();

const Tab = createMaterialBottomTabNavigator();

const Stack = createStackNavigator();

const AdaptiveText = (props) => {
	const scheme = useColorScheme();
	props.primaryColor ? null : (props.primaryColor = false);
	return (
		<Text
			variant={props.variant ? props.variant : null}
			style={{
				...props.style,
				color: scheme == "light" ? (props.primaryColor ? MD3LightTheme.colors.primary : MD3LightTheme.colors.onSurfaceVariant) : props.primaryColor ? MD3DarkTheme.colors.primary : MD3DarkTheme.colors.onSurfaceVariant
			}}
		>
			{props.children}
		</Text>
	);
};

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
							<DataTable.Cell>8:30am - 9:50am</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Second Block</DataTable.Cell>
							<DataTable.Cell>9:55am - 11:15am</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Lunch Break</DataTable.Cell>
							<DataTable.Cell>11:15am - 12:55pm</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Third Block</DataTable.Cell>
							<DataTable.Cell>12:00pm - 1:20pm</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Fourth Block</DataTable.Cell>
							<DataTable.Cell>1:25pm - 2:45pm</DataTable.Cell>
						</DataTable.Row>
					</DataTable>
					<Text variant="titleLarge">Tuesday Late Start</Text>
					<DataTable style={{ marginBottom: 50 }}>
						<DataTable.Row>
							<DataTable.Cell>Warning Bell</DataTable.Cell>
							<DataTable.Cell>9:10am</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>First Block</DataTable.Cell>
							<DataTable.Cell>9:15am - 10:25am</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Second Block</DataTable.Cell>
							<DataTable.Cell>10:30am - 11:40am</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Lunch Break</DataTable.Cell>
							<DataTable.Cell>11:40am - 12:15pm</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Third Block</DataTable.Cell>
							<DataTable.Cell>12:20pm - 1:30pm</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Fourth Block</DataTable.Cell>
							<DataTable.Cell>1:35pm - 2:45pm</DataTable.Cell>
						</DataTable.Row>
					</DataTable>

					<Text variant="titleLarge">Early Dismissal</Text>
					<DataTable style={{ marginBottom: 50 }}>
						<DataTable.Row>
							<DataTable.Cell>Warning Bell</DataTable.Cell>
							<DataTable.Cell>8:25am</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>First Block</DataTable.Cell>
							<DataTable.Cell>8:30am - 9:35am</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Second Block</DataTable.Cell>
							<DataTable.Cell>9:40am - 10:45am</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Lunch Break</DataTable.Cell>
							<DataTable.Cell>10:45am - 11:25pm</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Third Block</DataTable.Cell>
							<DataTable.Cell>11:30am - 12:35pm</DataTable.Cell>
						</DataTable.Row>
						<DataTable.Row>
							<DataTable.Cell>Fourth Block</DataTable.Cell>
							<DataTable.Cell>12:40pm - 1:45pm</DataTable.Cell>
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

class BlockRotation extends Component {
	constructor() {
		super();
		this.state = {
			currentBlock: ""
		};
		fetch("https://eagletime.fly.dev/block")
			.then((response) => response.json())
			.catch((error) => console.error(error))
			.then((data) => {
				if (data[0] != null) {
					this.setState({
						currentBlock: data[0]?.name
					});
				} else {
					this.setState({
						currentBlock: "No block rotation"
					});
				}
			});
	}
	render() {
		let date = new Date();
		let formattedDate = dayOfWeek[date.getDay()] + " " + months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
		return (
			<View>
				<Text variant="titleMedium">{formattedDate}</Text>
				<Text variant="titleLarge">{this.state.currentBlock}</Text>
			</View>
		);
	}
}

const Icon = (props) => {
	const scheme = useColorScheme();
	return <MaterialCommunityIcons name={props.icon} size={props.size} color={scheme == "light" ? MD3LightTheme.colors.onSurface : MD3DarkTheme.colors.onSurface} style={props.style} />;
};

class Weather extends Component {
	constructor() {
		super();
		this.state = {
			weather: "unknown",
			weatherName: "Unknown",
			temp: "--°C",
			lowTemp: "--°C",
			highTemp: "--°C"
		};
		fetch("https://eagletime.fly.dev/weather")
			.then((response) => response.json())
			.catch((error) => console.error(error))
			.then((data) => {
				this.setState({
					weather: data.weather[0]?.icon,
					weatherName: data.weather[0]?.description.charAt(0).toUpperCase() + data.weather[0]?.description.slice(1),
					temp: Math.round(data.main?.temp) + "°C",
					lowTemp: Math.round(data.main?.temp_min) + "°C",
					highTemp: Math.round(data.main?.temp_max) + "°C"
				});
			});
	}
	render() {
		return (
			<View style={styles.weather_section}>
				<View>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center"
						}}
					>
						<Icon icon={weatherIcons[this.state.weather]} size={36} />
						<Text variant="titleLarge" style={{ marginLeft: 10 }}>
							{this.state.temp}
						</Text>
					</View>
					<Text variant="titleLarge">{this.state.weatherName}</Text>
				</View>
				<View>
					<Text variant="titleMedium">{`Low: ${this.state.lowTemp}`}</Text>
					<Text variant="titleMedium">{`High: ${this.state.highTemp}`}</Text>
				</View>
			</View>
		);
	}
}

var navigateToMessageView = false;
var leaveMessageView = false;

var homeNotThemed = true;
const HomeRoute = ({ navigation }) => {
	const scheme = useColorScheme();
	const [refresh, setRefresh] = React.useState(false);
	setInterval(() => {
		if (homeNotThemed) {
			setRefresh(!refresh);
			homeNotThemed = false;
		}
	}, 1000);
	setInterval(() => {
		if (navigateToMessageView) {
			navigateToMessageView = false;
			navigation.navigate("View Message");
		}
		if (leaveMessageView) {
			leaveMessageView = false;
			navigation.goBack();
		}
	});
	const [imgViewerVisible, setImgViewerVisible] = React.useState(false);
	return (
		<View style={{ height: "100%" }}>
			<TopAppBar navigation={navigation} name="Home" />
			<ScrollView style={styles.scrollview}>
				<View style={styles.events}>
					<View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
						<Image
							style={{
								width: 32,
								height: 32,
								borderRadius: 10,
								marginRight: 8
							}}
							source={require("./assets/icon.png")}
						/>
						<Text variant="headlineSmall">JH Eagles</Text>
					</View>
					<Surface style={styles.section} elevation={2}>
						<BlockRotation />
						<View style={styles.line} />
						<Weather color={scheme == "light" ? MD3LightTheme.colors.onSurface : MD3DarkTheme.colors.onSurface} />
					</Surface>
					<Text variant="headlineSmall">Information</Text>
					<Surface style={styles.info_section} elevation={2}>
						<MaterialCommunityIcons name="bell-outline" size={24} color={scheme == "light" ? MD3LightTheme.colors.onSurface : MD3DarkTheme.colors.onSurface} />
						<View style={styles.view60}>
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
						<MaterialCommunityIcons name="map-outline" size={24} color={scheme == "light" ? MD3LightTheme.colors.onSurface : MD3DarkTheme.colors.onSurface} />
						<View style={styles.view60}>
							<Text variant="titleMedium">School Map</Text>
							<Text variant="bodySmall">Level 1 and Level 2</Text>
						</View>
						<Button
							mode="contained"
							onPress={() => {
								Vibration.vibrate(5);
								// Linking.openURL("https://eagletime.appazur.com/media/info/eagletime/map_JH_2019_.jpg_CvI94vg.png");
								setImgViewerVisible(true);
							}}
						>
							View
						</Button>
					</Surface>
					<Surface style={styles.info_section} elevation={2}>
						<MaterialCommunityIcons name="earth" size={24} color={scheme == "light" ? MD3LightTheme.colors.onSurface : MD3DarkTheme.colors.onSurface} />
						<View style={styles.view60}>
							<Text variant="titleMedium">Website</Text>
							<Text variant="bodySmall">www.surreyschools.ca/johnht</Text>
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
						<MaterialCommunityIcons name="school-outline" size={24} color={scheme == "light" ? MD3LightTheme.colors.onSurface : MD3DarkTheme.colors.onSurface} />
						<View style={styles.view60}>
							<Text variant="titleMedium">MyEdBC</Text>
							<Text variant="bodySmall">Check grades, schedule, and view report cards</Text>
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
						<MaterialCommunityIcons name="cash" size={24} color={scheme == "light" ? MD3LightTheme.colors.onSurface : MD3DarkTheme.colors.onSurface} />
						<View style={styles.view60}>
							<Text variant="titleMedium">School Cash Online</Text>
							<Text variant="bodySmall">Pay school fees</Text>
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
						<MaterialCommunityIcons name="account-supervisor-outline" size={24} color={scheme == "light" ? MD3LightTheme.colors.onSurface : MD3DarkTheme.colors.onSurface} />
						<View style={styles.view60}>
							<Text variant="titleMedium">Counsellor Appointments</Text>
							<Text variant="bodySmall">Book an appointment online</Text>
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
						<MaterialCommunityIcons name="locker-multiple" size={24} color={scheme == "light" ? MD3LightTheme.colors.onSurface : MD3DarkTheme.colors.onSurface} />
						<View style={styles.view60}>
							<Text variant="titleMedium">Locker Assignments</Text>
							<Text variant="bodySmall">Register and choose a locker. Student ID# required</Text>
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
						<MaterialCommunityIcons name="phone-outline" size={24} color={scheme == "light" ? MD3LightTheme.colors.onSurface : MD3DarkTheme.colors.onSurface} />
						<View style={styles.view60}>
							<Text variant="titleMedium">Phone</Text>
							<Text variant="bodySmall">(604)-581-5500</Text>
						</View>
						<Button
							mode="contained"
							onPress={() => {
								Vibration.vibrate(5);
								Linking.openURL("tel:+16045815500");
							}}
						>
							Call
						</Button>
					</Surface>
					<Surface style={styles.info_section} elevation={2}>
						<MaterialCommunityIcons name="map-marker-outline" size={24} color={scheme == "light" ? MD3LightTheme.colors.onSurface : MD3DarkTheme.colors.onSurface} />
						<View style={styles.view60}>
							<Text variant="titleMedium">Map and Directions</Text>
							<Text variant="bodySmall">15350 - 99th Avenue, Surrey, BC V3R 0R9</Text>
						</View>
						<Button
							mode="contained"
							onPress={() => {
								Vibration.vibrate(5);
								Linking.openURL("https://goo.gl/maps/K8cF7KdCun4r6RV89");
							}}
						>
							View
						</Button>
					</Surface>
				</View>
				<View style={styles.main} />
			</ScrollView>
			<ImageView
				images={[{ uri: schoolMap.mapUri }]}
				imageIndex={0}
				visible={imgViewerVisible}
				onRequestClose={() => {
					setImgViewerVisible(false);
				}}
				backgroundColor={scheme == "light" ? "#FFF" : "#000"}
				HeaderComponent={() => {
					return (
						<View
							style={{
								padding: 15,
								paddingTop: 25,
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
								backgroundColor: scheme == "light" ? "#FFFA" : "#000A"
							}}
						>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center"
								}}
							>
								<Pressable
									onPress={() => {
										setImgViewerVisible(false);
									}}
									style={{
										marginRight: 10
									}}
								>
									<Icon icon="window-close" size={24} />
								</Pressable>
								<Text>School map</Text>
							</View>
							{/* <Pressable
								onPress={() => {
									Linking.openURL(a.url);
								}}
								style={{
									marginLeft: 10
								}}
							>
								<Icon icon="open-in-app" size={24} />
							</Pressable> */}
						</View>
					);
				}}
			/>
		</View>
	);
};

const MessageCard = ({ time, text, attachments, index, totalIndex, url }) => {
	const scheme = useColorScheme();
	var images = [];
	if (attachments.length > 0) {
		for (let i = 0; i < attachments.length; i++) {
			if (attachments[i].url.match(/\.(jpg|jpeg|png|gif)/)) {
				images.push(attachments[i]);
			}
		}
	}
	var showImages = images.map((a) => {
		const [imgViewerVisible, setImgViewerVisible] = React.useState(false);
		return (
			<View key={index}>
				<ImageView
					images={[{ uri: a.url }]}
					imageIndex={0}
					visible={imgViewerVisible}
					onRequestClose={() => {
						setImgViewerVisible(false);
					}}
					backgroundColor={scheme == "light" ? "#FFF" : "#000"}
					HeaderComponent={() => {
						return (
							<View
								style={{
									padding: 15,
									paddingTop: 25,
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
									backgroundColor: scheme == "light" ? "#FFFA" : "#000A"
								}}
							>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center"
									}}
								>
									<Pressable
										onPress={() => {
											setImgViewerVisible(false);
										}}
										style={{
											marginRight: 10
										}}
									>
										<Icon icon="window-close" size={24} />
									</Pressable>
									<Text>{a.url.replace(/https?:(.*\/)+/, "")}</Text>
								</View>
								<Pressable
									onPress={() => {
										Linking.openURL(a.url);
									}}
									style={{
										marginLeft: 10
									}}
								>
									<Icon icon="open-in-app" size={24} />
								</Pressable>
							</View>
						);
					}}
				/>
				<Pressable
					onPress={() => {
						setImgViewerVisible(true);
					}}
				>
					<Image
						style={{
							width: "100%",
							height: undefined,
							aspectRatio: a.x / a.y,
							borderRadius: 10,
							marginTop: 10
						}}
						source={{
							uri: a.url
						}}
					/>
				</Pressable>
			</View>
		);
	});
	return (
		<View style={styles.events}>
			<Surface style={{ ...styles.info_section, padding: 0 }} elevation={2}>
				<TouchableRipple
					onPress={() => {
						navigateToMessageView = true;
						messageUrl = url;
					}}
					style={{
						borderRadius: 15,
						overflow: "hidden",
						width: "100%",
						height: "100%"
					}}
					borderless={true}
				>
					<View
						style={{
							width: "100%",
							height: "100%",
							padding: 25
						}}
					>
						<Text variant="bodySmall">{time}</Text>
						<Text variant="titleSmall">{text}</Text>
						{showImages}
					</View>
				</TouchableRipple>
			</Surface>
			{index == totalIndex - 1 ? <View style={{ height: 280 }} /> : null}
		</View>
	);
};

var messageUrl;
var ViewMessageRoute = ({ navigation }) => {
	const isFocused = useIsFocused();
	const scheme = useColorScheme();
	return (
		<View style={{ height: "100%" }}>
			{isFocused ? (
				<WebView
					originWhitelist={["*"]}
					javaScriptEnabled={true}
					domStorageEnabled={false}
					startInLoadingState={false}
					scalesPageToFit={false}
					scrollEnabled={true}
					forceDarkOn={scheme == "dark"}
					source={{ uri: messageUrl }}
					style={{
						width: "100%",
						height: "100%"
					}}
					ref={(ref) => {
						this.webview = ref;
					}}
					injectedJavaScript={`
					(function() {
						var links = document.links;
						for (var i = 0; i < links.length; i++) {
							 links[i].target = "_blank";
						}
						var images = document.querySelectorAll("a:has(> img)");
						for (var i = 0; i < images.length; i++) {
							images[i].removeAttribute("href")
						}
						setInterval(() => {
							var links = document.links;
							for (var i = 0; i < links.length; i++) {
								 links[i].target = "_blank";
							}
							var images = document.querySelectorAll("a:has(> img)");
							for (var i = 0; i < images.length; i++) {
								images[i].removeAttribute("href")
							}
						}, 200)
					})()
					`}
				/>
			) : null}
		</View>
	);
};

const MessagesRoute = ({ navigation }) => {
	const isFocused = useIsFocused();

	return (
		<View>
			<TopAppBar navigation={navigation} name="Messages" />
			{isFocused ? <MessagesScreen /> : null}
		</View>
	);
};

class MessagesScreen extends Component {
	constructor() {
		super();
		this.state = {
			messageList: []
		};
		fetch("https://eagletime.fly.dev/messages")
			.then((response) => response.json())
			.catch((error) => console.error(error))
			.then((messages) => {
				this.setState({
					messageList: messages
				});
			});
	}
	render() {
		return (
			<View>
				<FlatList
					style={styles.scrollview}
					data={this.state.messageList}
					renderItem={({ item, index }) => {
						return <MessageCard time={item.date} text={item.text} attachments={item.atts} index={index} totalIndex={this.state.messageList.length} url={item.url} />;
					}}
				/>
				<ActivityIndicator animating={true} size={"small"} style={{ marginTop: 20 }} />
			</View>
		);
	}
}

const CalendarPicker = (props) => {
	const scheme = useColorScheme();
	return (
		<DatePicker
			mode={props.mode}
			options={
				scheme == "light"
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
			minimumDate={props.minimumDate}
			maximumDate={props.maximumDate}
			onDateChange={props.onDateChange}
		/>
	);
};

var CalendarRoute = ({ navigation }) => {
	const isFocused = useIsFocused();

	return (
		<View>
			<TopAppBar navigation={navigation} name="Calendar" />
			<View
				style={{
					height: "100%",
					marginBottom: -184
				}}
			>
				{isFocused ? <CalendarScreen /> : null}
			</View>
		</View>
	);
};

class CalendarScreen extends Component {
	constructor() {
		super();
		this.state = {
			eventList: [],
			fabExtended: true,
			calendarVisible: false,
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
	}
	render() {
		var appendedDates = [];

		var events = this.state.eventList.map((data, index) => {
			if (!appendedDates.includes(data.date)) {
				var includeDate = true;
				appendedDates.push(data.date);
				let date = new Date(data.date);
				date.setUTCHours(16);
				var formattedDate = dayOfWeek[date.getDay()] + " " + months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
			} else {
				var includeDate = false;
			}

			return (
				<View
					key={includeDate ? data.date : index}
					style={styles.events}
					onLayout={
						includeDate
							? (event) => {
									this.state.datePositions[data.date] = Math.floor(event.nativeEvent.layout.y);
							  }
							: null
					}
				>
					{appendedDates.length > 1 && includeDate ? <View style={styles.line} /> : null}
					{includeDate ? (
						data.cal_mode === 1 ? (
							<Text variant="titleMedium" style={{ marginTop: 20 }}>
								{formattedDate} — <Text variant="titleLarge">{data.name}</Text>
							</Text>
						) : (
							<Text variant="titleMedium" style={{ marginTop: 20 }}>
								{formattedDate}
							</Text>
						)
					) : null}
					{data.cal_mode === 1 ? null : (
						<Surface style={styles.info_section} elevation={2}>
							<View>
								<Text variant="titleLarge">{data.name}</Text>
								{data.start ? (
									data.end ? (
										<Text style={styles.text_with_margin} variant="titleMedium">
											{data.start} - {data.end}
										</Text>
									) : (
										<Text style={styles.text_with_margin} variant="titleMedium">
											{data.start}
										</Text>
									)
								) : (
									<View style={styles.text_with_margin}></View>
								)}
								{data.description ? <HtmlText html={data.description}></HtmlText> : null}
							</View>
						</Surface>
					)}
				</View>
			);
		});

		return (
			<View style={{ height: "100%" }}>
				<Portal>
					<Dialog dismissable={true} visible={this.state.calendarVisible} onDismiss={() => this.setState({ calendarVisible: false })}>
						<Dialog.Title>Pick a date</Dialog.Title>
						<Dialog.Content>
							<CalendarPicker
								mode="calendar"
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
							<Button
								onPress={() => {
									this.setState({ calendarVisible: false });
								}}
							>
								Cancel
							</Button>
							<Button
								onPress={() => {
									this.setState({ calendarVisible: false });
									if (this.state.datePositions[this.state.selectedDate]) {
										this.scrollViewElement.scrollTo({ x: 0, y: this.state.datePositions[this.state.selectedDate], animated: true });
									} else {
										this.setState({ snackbarVisible: true });
										setTimeout(() => {
											this.setState({ snackbarVisible: false });
										}, 5000);
									}
								}}
							>
								OK
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
				>
					Selected date is not on the calendar.
				</Snackbar>
				<AnimatedFAB
					icon={"calendar"}
					label={"Calendar view"}
					extended={this.state.fabExtended}
					onPress={() => this.setState({ calendarVisible: true })}
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

function sortAssignments(a, b) {
	if (a.date < b.date) {
		return -1;
	}
	if (a.date > b.date) {
		return 1;
	}
	return 0;
}

var assignmentsNotThemed = true;
const AssignmentRoute = ({ navigation }) => {
	const [refresh, setRefresh] = React.useState(false);
	setInterval(() => {
		if (assignmentsNotThemed) {
			setRefresh(!refresh);
			assignmentsNotThemed = false;
		}
	}, 1000);
	const [dialogVisible, setDialogVisible] = React.useState(false);
	const [calendarVisible, setCalendarVisible] = React.useState(false);

	const [assignmentName, setAssignmentName] = React.useState("");
	const [className, setClassName] = React.useState("");

	const [assignmentNameError, setAssignmentNameError] = React.useState(false);
	const [classNameError, setClassNameError] = React.useState(false);

	var today = new Date(Date.now());
	var formattedTodayDate = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();
	const [dueDate, setDueDate] = React.useState(formattedTodayDate);
	const [notes, setNotes] = React.useState("");

	const [assignments, setAssignments] = React.useState(assignmentsStore.sort(sortAssignments));
	if (assignments[0]) {
		var assignmentsList = assignments.map((data, index) => {
			return (
				<View style={styles.events} key={index}>
					<Surface elevation={2} style={styles.info_section}>
						<View
							style={{
								width: "100%"
							}}
						>
							<View
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									flexDirection: "row"
								}}
							>
								<AdaptiveText variant="titleLarge">{data.name}</AdaptiveText>
								<IconButton
									icon="trash-can-outline"
									size={20}
									onPress={() => {
										var newList = assignments;
										newList.splice(index, 1);
										storeJsonData("assignments", newList);
										setTimeout(() => {
											setAssignments(newList);
										});
										setAssignments([]);
									}}
								/>
							</View>
							<AdaptiveText variant="titleSmall" style={{ marginBottom: 10 }}>
								{data.subject}
							</AdaptiveText>
							<AdaptiveText variant="titleMedium">Due: {data.date}</AdaptiveText>
							{data.comments && (
								<View>
									<AdaptiveText variant="titleMedium">Notes:</AdaptiveText>
									<Surface style={styles.info_section} elevation={3}>
										<View style={{ width: "100%" }}>
											<AdaptiveText variant="titleSmall">{data.comments}</AdaptiveText>
										</View>
									</Surface>
								</View>
							)}
						</View>
					</Surface>
				</View>
			);
		});
	} else {
		assignmentsList = (
			<View style={{ ...styles.events, width: "100%", display: "flex", flexDirection: "column", alignContent: "center" }}>
				<AdaptiveText variant="titleMedium" style={{ textAlign: "center" }}>
					Nothing here...
				</AdaptiveText>
				<AdaptiveText variant="titleMedium" style={{ textAlign: "center" }}>
					Click the + button the add an assignment
				</AdaptiveText>
			</View>
		);
	}
	return (
		<View style={{ height: "100%" }}>
			<TopAppBar navigation={navigation} name="Assignments" />
			<ScrollView style={styles.scrollview}>
				{assignmentsList}
				<View style={styles.main} />
			</ScrollView>
			<AnimatedFAB
				icon={"plus"}
				label={"Create"}
				extended={false}
				onPress={() => {
					setDialogVisible(true);
				}}
				visible={true}
				animateFrom={"right"}
				iconMode={"dynamic"}
				style={{
					bottom: 16,
					right: 16,
					position: "absolute",
					zIndex: 9999
				}}
			/>
			<Portal>
				<Dialog
					visible={dialogVisible}
					onDismiss={() => {
						setDialogVisible(false);
					}}
					style={{
						marginVertical: 100
					}}
				>
					<Dialog.Title>Add assignment</Dialog.Title>
					<Dialog.ScrollArea
						style={{
							borderColor: "#0000",
							borderWidth: 0
						}}
					>
						<ScrollView>
							<TextInput
								style={{
									marginBottom: 10
								}}
								label="Assignment name"
								mode="outlined"
								error={assignmentNameError}
								value={assignmentName}
								onChangeText={(text) => setAssignmentName(text)}
							/>
							<TextInput
								style={{
									marginBottom: 10
								}}
								label="Class"
								mode="outlined"
								error={classNameError}
								value={className}
								onChangeText={(text) => setClassName(text)}
							/>
							<Pressable
								onPress={() => {
									setCalendarVisible(true);
								}}
							>
								<TextInput
									style={{
										marginBottom: 10
									}}
									label="Date"
									mode="outlined"
									value={dueDate}
									editable={false}
								/>
							</Pressable>
							<TextInput label="Notes" mode="outlined" multiline={true} numberOfLines={5} value={notes} onChangeText={(text) => setNotes(text)} />
						</ScrollView>
					</Dialog.ScrollArea>
					<Dialog.Actions>
						<Button
							onPress={() => {
								setAssignmentNameError(false);
								setClassNameError(false);
								setAssignmentName("");
								setClassName("");
								setNotes("");
								setDueDate(formattedTodayDate);
								setDialogVisible(false);
							}}
						>
							Cancel
						</Button>
						<Button
							onPress={() => {
								if (!assignmentName) {
									setAssignmentNameError(true);
								} else {
									setAssignmentNameError(false);
								}
								if (!className) {
									setClassNameError(true);
								} else {
									setClassNameError(false);
								}
								if (assignmentName && className) {
									var data = {
										name: assignmentName,
										subject: className,
										date: dueDate,
										comments: notes
									};
									var prepareAssignmentList = assignments;
									prepareAssignmentList.push(data);
									prepareAssignmentList.sort(sortAssignments);
									storeJsonData("assignments", prepareAssignmentList);
									setAssignmentNameError(false);
									setClassNameError(false);
									setAssignmentName("");
									setClassName("");
									setNotes("");
									setDueDate(formattedTodayDate);
									setDialogVisible(false);
								}
							}}
						>
							Add
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
			<Portal>
				<Dialog
					visible={calendarVisible}
					onDismiss={() => {
						setCalendarVisible(false);
					}}
				>
					<Dialog.Title>Pick a date</Dialog.Title>
					<Dialog.Content>
						<CalendarPicker
							mode="calendar"
							onDateChange={(date) => {
								setDueDate(date);
								setCalendarVisible(false);
							}}
						/>
					</Dialog.Content>
				</Dialog>
			</Portal>
		</View>
	);
};

class GithubUser extends Component {
	constructor() {
		super();
		this.state = {
			contributors: []
		};
		fetch("https://api.github.com/repos/chakornk/eagletime-react-native/contributors")
			.then((response) => response.json())
			.catch((error) => console.error(error))
			.then((data) => {
				this.setState({
					contributors: data
				});
			});
	}
	render() {
		var users = this.state.contributors.map((data, i) => {
			var user = data[0] ? data[i] : data;
			return (
				<TouchableRipple
					onPress={() => {
						Linking.openURL(user.html_url);
					}}
					style={{
						marginHorizontal: -25,
						paddingVertical: 10,
						paddingHorizontal: 25
					}}
					key={i}
				>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "flex-start"
						}}
					>
						<Image
							style={{
								width: 48,
								height: 48,
								borderRadius: 9999,
								marginRight: 10
							}}
							source={{
								uri: `https://avatars.githubusercontent.com/u/${user.id}`
							}}
						/>
						<View>
							<Text variant="titleMedium">{user.login}</Text>
							<AdaptiveText variant="titleSmall">{user.contributions} contributions</AdaptiveText>
						</View>
					</View>
				</TouchableRipple>
			);
		});

		return <View>{users}</View>;
	}
}

const AboutScreen = () => {
	const scheme = useColorScheme();
	return (
		<PaperProvider theme={scheme == "light" ? MD3LightTheme : MD3DarkTheme}>
			<View style={{ height: "100%" }}>
				<ScrollView style={styles.scrollview}>
					<View style={styles.events}>
						<View
							style={{
								display: "flex",
								width: "100%",
								alignItems: "center",
								justifyContent: "center",
								marginTop: 20
							}}
						>
							<Image
								style={{
									width: 96,
									height: 96,
									borderRadius: 25,
									marginBottom: 15
								}}
								source={require("./assets/icon.png")}
							/>
							<Text variant="titleLarge">JH Eagles</Text>
							<AdaptiveText
								variant="titleSmall"
								style={{
									marginBottom: 5
								}}
							>
								A redesigned version of the EagleTime app
							</AdaptiveText>
							<Button
								icon="github"
								mode="text"
								onPress={() => {
									Linking.openURL("https://github.com/chakornk/jheagles-react-native");
								}}
							>
								Github
							</Button>
						</View>
						<View style={styles.line} />
						<Text
							variant="titleLarge"
							style={{
								marginBottom: 20
							}}
						>
							Made by
						</Text>
						<GithubUser />
					</View>
				</ScrollView>
			</View>
		</PaperProvider>
	);
};

var settingsNotThemed = true;
const SettingsRoute = ({ navigation }) => {
	const [colorPicker, setColorPicker] = React.useState(false);
	const [color, setColor] = React.useState(accentColor);
	var tempColor;

	const [colorTheme, setColorTheme] = React.useState(theme);

	const [snackbarVisible, setSnackbarVisible] = React.useState(false);

	const [refresh, setRefresh] = React.useState(false);
	setInterval(() => {
		if (settingsNotThemed) {
			setRefresh(!refresh);
			settingsNotThemed = false;
		}
	}, 1000);
	return (
		<View style={{ height: "100%" }}>
			<TopAppBar navigation={navigation} name="Settings" />
			<ScrollView style={styles.scrollview}>
				<View style={styles.events}>
					<AdaptiveText
						variant="titleSmall"
						primaryColor={true}
						style={{
							marginBottom: 10
						}}
					>
						Appearence
					</AdaptiveText>
					<TouchableRipple
						onPress={() => {
							setColorPicker(true);
						}}
						style={{
							marginHorizontal: -25,
							paddingVertical: 10,
							paddingHorizontal: 25
						}}
					>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between"
							}}
						>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center"
								}}
							>
								<Icon icon="palette-outline" size={24} style={{ marginRight: 10 }} />
								<View>
									<Text variant="titleLarge">Accent color</Text>
									<AdaptiveText variant="titleSmall">Change the color of the app</AdaptiveText>
								</View>
							</View>
							<View
								style={{
									backgroundColor: color,
									width: 36,
									height: 36,
									borderRadius: 9999
								}}
							/>
						</View>
					</TouchableRipple>
					<View>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "flex-start"
							}}
						>
							<Icon icon="theme-light-dark" size={24} style={{ marginRight: 10 }} />
							<View>
								<Text variant="titleLarge">Theme</Text>
								<AdaptiveText variant="titleSmall">Control the app's theme</AdaptiveText>
							</View>
						</View>
						<Surface
							style={{
								paddingVertical: 10,
								borderRadius: 15,
								marginTop: 10
							}}
						>
							<RadioButton.Group
								onValueChange={(value) => {
									setColorTheme(value);
									setSnackbarVisible(true);
									setTimeout(() => {
										setSnackbarVisible(false);
									}, 5000);
									storeData("theme", value);
								}}
								value={colorTheme}
							>
								<RadioButton.Item style={{ paddingHorizontal: 20 }} label="System" value="auto" />
								<RadioButton.Item style={{ paddingHorizontal: 20 }} label="Light" value="light" />
								<RadioButton.Item style={{ paddingHorizontal: 20 }} label="Dark" value="dark" />
							</RadioButton.Group>
						</Surface>
					</View>
					<AdaptiveText
						variant="titleSmall"
						primaryColor={true}
						style={{
							marginTop: 25,
							marginBottom: 10
						}}
					>
						Info
					</AdaptiveText>
					<TouchableRipple
						onPress={() => {
							navigation.navigate("About");
						}}
						style={{
							marginHorizontal: -25,
							paddingVertical: 10,
							paddingHorizontal: 25
						}}
					>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between"
							}}
						>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center"
								}}
							>
								<Icon icon="information-outline" size={24} style={{ marginRight: 10 }} />
								<View>
									<Text variant="titleLarge">About</Text>
									<AdaptiveText variant="titleSmall">Information about the app</AdaptiveText>
								</View>
							</View>
						</View>
					</TouchableRipple>
				</View>
			</ScrollView>
			<Portal>
				<Dialog dismissable={true} visible={colorPicker} onDismiss={() => setColorPicker(false)}>
					<Dialog.Title>Choose accent color</Dialog.Title>
					<Dialog.Content>
						<View
							style={{
								height: 300
							}}
						>
							<ColorPicker
								color={color}
								onColorChangeComplete={(color) => {
									tempColor = color;
								}}
								palette={["#000000", "#ed1c24", "#f2aa44", "#ffde17", "#57ff0a", "#00c85d", "#00ccef", "#3358e6", "#d11cd5"]}
							/>
						</View>
					</Dialog.Content>
					<Dialog.Actions>
						<Button
							onPress={() => {
								tempColor = "#4285F4";
								setColor(tempColor);
							}}
						>
							Reset
						</Button>
						<Button
							onPress={() => {
								setColorPicker(false);
							}}
						>
							Cancel
						</Button>
						<Button
							onPress={() => {
								setColorPicker(false);
								setColor(tempColor);
								storeData("accentColor", tempColor);
								reloadColorPalette();
							}}
						>
							OK
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
			<Snackbar
				visible={snackbarVisible}
				onDismiss={() => {
					setSnackbarVisible(false);
				}}
				action={{
					label: "Dismiss",
					onPress: () => {
						setSnackbarVisible(false);
					}
				}}
				style={{
					zIndex: 99999
				}}
			>
				Restart the app to change theme.
			</Snackbar>
		</View>
	);
};

const MainScreenFunc = () => {
	const scheme = useColorScheme();
	return (
		<PaperProvider theme={scheme == "light" ? MD3LightTheme : MD3DarkTheme}>
			<Tab.Navigator shifting={false} initialRouteName="Home" backBehavior="history">
				<Tab.Screen
					name="Messages"
					component={MessagesRoute}
					options={{
						tabBarIcon: ({ focused, color }) => (focused ? <MaterialCommunityIcons name="bell" color={color} size={24} /> : <MaterialCommunityIcons name="bell-outline" color={color} size={24} />)
					}}
					listeners={() => ({
						tabPress: (e) => {
							Vibration.vibrate(5);
							CalendarRoute = () => {
								return <View />;
							};
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
							CalendarRoute = ({ navigation }) => {
								const isFocused = useIsFocused();

								return (
									<View>
										<TopAppBar navigation={navigation} name="Calendar" />
										<View
											style={{
												height: "100%",
												marginBottom: -184
											}}
										>
											{isFocused ? <CalendarScreen /> : null}
										</View>
									</View>
								);
							};
						}
					})}
				/>
				<Tab.Screen
					name="Home"
					component={HomeRoute}
					options={{
						tabBarIcon: ({ focused, color }) => (focused ? <MaterialCommunityIcons name="home" color={color} size={24} /> : <MaterialCommunityIcons name="home-outline" color={color} size={24} />)
					}}
					listeners={() => ({
						tabPress: (e) => {
							Vibration.vibrate(5);
							CalendarRoute = () => {
								return <View />;
							};
						}
					})}
				/>
				<Tab.Screen
					name="Assignments"
					component={AssignmentRoute}
					options={{
						tabBarIcon: ({ focused, color }) => (focused ? <MaterialCommunityIcons name="clipboard-list" color={color} size={24} /> : <MaterialCommunityIcons name="clipboard-list-outline" color={color} size={24} />)
					}}
					listeners={() => ({
						tabPress: (e) => {
							Vibration.vibrate(5);
							CalendarRoute = () => {
								return <View />;
							};
						}
					})}
				/>
				<Tab.Screen
					name="Settings"
					component={SettingsRoute}
					options={{
						tabBarIcon: ({ focused, color }) => (focused ? <MaterialCommunityIcons name="cog" color={color} size={24} /> : <MaterialCommunityIcons name="cog-outline" color={color} size={24} />)
					}}
					listeners={() => ({
						tabPress: (e) => {
							Vibration.vibrate(5);
							CalendarRoute = () => {
								return <View />;
							};
						}
					})}
				/>
			</Tab.Navigator>
		</PaperProvider>
	);
};

var mainScreenNotThemed = true;
class MainScreen extends Component {
	constructor() {
		super();
		setInterval(() => {
			if (mainScreenNotThemed) {
				this.forceUpdateState();
				mainScreenNotThemed = false;
			}
		}, 1000);
	}
	forceUpdateState = () => {
		this.forceUpdate();
	};
	render() {
		return <MainScreenFunc />;
	}
}

const TopNavBar = ({ navigation, route, options, back }) => {
	const scheme = useColorScheme();
	if (route.name != "Main") {
		return (
			<Appbar.Header mode="small" elevated="true" theme={scheme == "light" ? MD3LightTheme : MD3DarkTheme}>
				{back ? <Appbar.BackAction onPress={navigation.goBack} color={scheme == "light" ? MD3LightTheme.colors.onSurface : MD3DarkTheme.colors.onSurface} /> : null}
				<Appbar.Content title={route.name} theme={scheme == "light" ? MD3LightTheme : MD3DarkTheme} titleStyle={{ marginLeft: 10, marginBottom: -10, paddingTop: 5, fontSize: 32 }} />
			</Appbar.Header>
		);
	}
};

var topBarNotThemed = true;
const TopAppBar = ({ navigation, name }) => {
	const scheme = useColorScheme();
	const [refresh, setRefresh] = React.useState(false);
	setInterval(() => {
		if (topBarNotThemed) {
			setRefresh(!refresh);
			topBarNotThemed = false;
		}
	}, 1000);
	return (
		<Appbar.Header mode="small" elevated="true" theme={scheme == "light" ? MD3LightTheme : MD3DarkTheme} style={{}}>
			<Appbar.Content title={name} titleStyle={{ marginLeft: 10, marginBottom: -10, paddingTop: 5, fontSize: 32 }} />
		</Appbar.Header>
	);
};

const App = () => {
	const scheme = useColorScheme();
	return (
		<NavigationContainer theme={scheme == "light" ? MD3LightTheme : MD3DarkTheme}>
			<StatusBar barStyle={scheme == "light" ? "dark-content" : "light-content"} backgroundColor="#00000000" translucent={true} />
			<Stack.Navigator
				screenOptions={{
					header: (props) => <TopNavBar {...props} />,
					presentation: "modal",
					cardStyleInterpolator: ({ current }) => ({
						cardStyle: {
							opacity: current.progress
						}
					})
				}}
			>
				<Stack.Screen name="Main" component={MainScreen} />
				<Stack.Screen name="Bell Schedule" component={BellSchedule} />
				<Stack.Screen name="About" component={AboutScreen} />
				<Stack.Screen name="View Message" component={ViewMessageRoute} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

var appParentNotThemed = true;
class AppParent extends Component {
	forceUpdateState = () => {
		this.forceUpdate();
	};
	render() {
		setInterval(() => {
			if (appParentNotThemed) {
				this.forceUpdateState();
				appParentNotThemed = false;
			}
		}, 1000);
		return <App />;
	}
}
export default AppParent;

const styles = StyleSheet.create({
	section: {
		padding: 25,
		borderRadius: 15,
		marginTop: 10,
		marginBottom: 25
	},
	info_section: {
		padding: 25,
		borderRadius: 15,
		marginVertical: 10,
		flexDirection: "row",
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center"
	},
	weather_section: {
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
	},
	view60: {
		width: "60%"
	},
	row: {
		display: "flex",
		flexDirection: "row"
	}
});
