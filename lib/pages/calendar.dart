import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

int lastEventWeek = 0;
int lastEventMonth = 0;

int findWeekOfYear(day, year) {
  // 1 is monday, 7 is sunday
  int weekdayOfJan1 = DateTime(year, 1, 1).weekday;
  int weekNumber = (day + weekdayOfJan1 - 1) ~/ 7;
  return weekNumber;
}

class CalendarEvent {
  int sid;
  int scheduleId;
  String schedType;
  String date;
  String end;
  String name;
  String location;
  String description;
  int calMode;

  CalendarEvent({
    required this.sid,
    required this.scheduleId,
    required this.schedType,
    required this.date,
    required this.end,
    required this.name,
    required this.location,
    required this.description,
    required this.calMode,
  });

  factory CalendarEvent.fromJson(Map<String, dynamic> event) {
    return CalendarEvent(
      sid: event['sid'] ?? 0,
      scheduleId: event['schedule_id'] ?? 0,
      schedType: event['sched_type']?.toString() ?? "",
      date: event['date']?.toString() ?? "",
      end: event['end']?.toString() ?? "",
      name: event['name']?.toString() ?? "",
      location: event['location']?.toString() ?? "",
      description: event['description']?.toString() ?? "",
      calMode: event['cal_mode'] ?? 0,
    );
  }
}

class CalendarPage extends StatefulWidget {
  @override
  State<CalendarPage> createState() => _CalendarPageState();
}

class _CalendarPageState extends State<CalendarPage> {
  late Future<List<CalendarEvent>> futureData;
  bool isLoading = true;

  Future<List<CalendarEvent>> fetchData() async {
    final response = await http.get(Uri.parse("https://eagletime.vercel.app/calendar"));

    isLoading = false;
    if (response.statusCode == 200 && response.body.isNotEmpty) {
      // If the call to the server was successful, parse the JSON
      var lst = jsonDecode(response.body) as List;
      return lst.map((d) => CalendarEvent.fromJson(d)).toList();
    } else {
      return [];
    }
  }

  @override
  void initState() {
    super.initState();
    futureData = fetchData();
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (BuildContext context, BoxConstraints viewportConstraints) {
      return SingleChildScrollView(
        child: ConstrainedBox(
          constraints: BoxConstraints(minHeight: viewportConstraints.maxHeight),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Center(
                  child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    FutureBuilder<List<CalendarEvent>>(
                        future: futureData,
                        builder: (context, snapshot) {
                          if (snapshot.hasData && snapshot.data!.isNotEmpty) {
                            print("${snapshot.data!.length}");
                            return Column(
                                children: snapshot.data!.map((e) {
                              List<Widget> widgetList = [];

                              List<String> date = e.date.toString().split("-");
                              int day = int.parse(date[2]);
                              int month = int.parse(date[1]);
                              int year = int.parse(date[0]);

                              if (month != lastEventMonth) {
                                widgetList.add(Text("${date[1]}/${date[2]}"));
                              }

                              int currentWeek = findWeekOfYear(day, year);
                              if (currentWeek != lastEventWeek) {
                                lastEventWeek = currentWeek;
                                widgetList.add(Text("Week $currentWeek"));
                              }
                              return Column(
                                children: widgetList,
                              );
                            }).toList());
                          } else if (snapshot.hasData && snapshot.data!.isEmpty && !isLoading) {
                            return Column(
                              mainAxisSize: MainAxisSize.max,
                              children: [
                                Text('${snapshot.error ?? "Failed to load data"}'),
                                SizedBox(height: 10),
                                FilledButton.tonalIcon(
                                  onPressed: () {
                                    isLoading = true;
                                    futureData = fetchData();
                                    setState(() {});
                                  },
                                  icon: Icon(
                                    Icons.refresh_rounded,
                                    size: 20,
                                  ),
                                  label: Text("Retry"),
                                ),
                              ],
                            );
                          }

                          // By default, show a loading spinner.
                          return const CircularProgressIndicator();
                        })
                  ],
                ),
              ))
            ],
          ),
        ),
      );
    });
  }
}
