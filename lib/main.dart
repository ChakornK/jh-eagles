import 'package:dynamic_color/dynamic_color.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:jh_eagles/components/indexedstackslider.dart';
import 'package:jh_eagles/pages/calendar.dart';
import 'package:jh_eagles/pages/messages.dart';
import 'package:provider/provider.dart';

import 'package:jh_eagles/pages/home.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    SystemUiOverlayStyle(
      systemNavigationBarColor: Colors.transparent,
      systemNavigationBarDividerColor: Colors.transparent,
    ),
  );
  SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge, overlays: [
    SystemUiOverlay.top,
  ]);

  runApp(MainScreen());
}

class MainScreen extends StatelessWidget {
  const MainScreen({super.key});

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
            debugShowCheckedModeBanner: false,
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
          child: AnimatedIndexedStack(
            key: Key("e"),
            index: currentPageIndex,
            children: [HomePage(), MessagesPage(), CalendarPage()],
          ),
        ));
  }
}
