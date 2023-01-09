import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { Text, Appbar, Button, MD3DarkTheme, MD3LightTheme, Provider as PaperProvider, adaptNavigationTheme, Surface, DataTable, ActivityIndicator, AnimatedFAB, Portal, Dialog } from "react-native-paper";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native";

const Tab = createMaterialBottomTabNavigator();

// const { LightTheme, DarkTheme } = adaptNavigationTheme({
// 	light: NavigationDefaultTheme,
// 	dark: NavigationDarkTheme
// });

const lightTheme = {
	...MD3LightTheme,
	...NavigationDefaultTheme,
	colors: {
		...MD3LightTheme.colors,
		...NavigationDefaultTheme.colors
	}
};
const darkTheme = {
	...MD3DarkTheme,
	...NavigationDarkTheme,
	colors: {
		...MD3DarkTheme.colors,
		...NavigationDarkTheme.colors
	}
};

const HomeRoute = ({ navigation }) => {
	// const scheme = useColorScheme();
	return (
		<Appbar.Header mode="small" elevated="true">
			<Text variant="headlineLarge" style={{ marginLeft: 25 }}>
				Messages
			</Text>
		</Appbar.Header>
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
const CalendarRoute = ({ navigation }) => {
	// const scheme = useColorScheme();
	return (
		<Appbar.Header mode="small" elevated="true">
			<Text variant="headlineLarge" style={{ marginLeft: 25 }}>
				Messages
			</Text>
		</Appbar.Header>
	);
};

const MainScreen = () => {
	return (
		<PaperProvider>
			<View style={styles.container}>
				<Text>Open up App.js to start working on your app!</Text>
				<StatusBar style="auto" />
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

export default function App() {
	return (
		<NavigationContainer theme={darkTheme}>
			<Stack.Navigator
				screenOptions={{
					header: (props) => <TopNavBar {...props} />
				}}
			>
				<Stack.Screen name="Main" component={MainScreen} />
				{/* <Stack.Screen name="Bell Schedule" component={BellSchedule} /> */}
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
	}
});
