import 'package:dynamic_color/dynamic_color.dart';
import 'package:flutter/material.dart';
import 'package:jh_eagles/pages/calendar.dart';
import 'package:jh_eagles/pages/messages.dart';
import 'package:provider/provider.dart';

import 'package:jh_eagles/pages/home.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  static final _defaultLightColorScheme = ColorScheme.fromSwatch(primarySwatch: Colors.blue);
  static final _defaultDarkColorScheme = ColorScheme.fromSwatch(primarySwatch: Colors.blue, brightness: Brightness.dark);

  @override
  Widget build(BuildContext context) {
    return DynamicColorBuilder(
      builder: (lightDynamic, darkDynamic) {
        return ChangeNotifierProvider(
          create: (context) => AppState(),
          child: MaterialApp(
            title: 'JH Eagles',
            theme: ThemeData(useMaterial3: true, colorScheme: lightDynamic ?? _defaultLightColorScheme, splashFactory: InkSparkle.splashFactory),
            darkTheme: ThemeData(useMaterial3: true, colorScheme: darkDynamic ?? _defaultDarkColorScheme, splashFactory: InkSparkle.splashFactory),
            home: StatefulApp(),
          ),
        );
      },
    );
  }
}

class AppState extends ChangeNotifier {}

class StatefulApp extends StatefulWidget {
  const StatefulApp({super.key});

  @override
  State<StatefulApp> createState() => AppContainer();
}

class AppContainer extends State<StatefulApp> {
  int currentPageIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        bottomNavigationBar: NavigationBar(
          selectedIndex: currentPageIndex,
          onDestinationSelected: (int index) {
            setState(() {
              currentPageIndex = index;
            });
          },
          destinations: <Widget>[
            NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
            NavigationDestination(
              icon: Icon(Icons.notifications_outlined),
              selectedIcon: Icon(Icons.notifications),
              label: 'Messages',
            ),
            NavigationDestination(
              icon: Icon(Icons.calendar_today_outlined),
              selectedIcon: Icon(Icons.calendar_today),
              label: 'Calendar',
            )
          ],
        ),
        body: SafeArea(
          child: IndexedStack(
            index: currentPageIndex,
            children: [HomePage(), MessagesPage(), CalendarPage()],
          ),
        ));
  }
}
