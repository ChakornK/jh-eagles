import 'dart:convert';
import 'dart:ui';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:http/http.dart' as http;
import 'package:jiffy/jiffy.dart';
import 'package:intl/intl.dart';

int lastEventDay = 0;
int lastEventWeek = 0;
int lastEventMonth = 0;

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
    var theme = Theme.of(context);

    return LayoutBuilder(builder: (BuildContext context, BoxConstraints viewportConstraints) {
      return SingleChildScrollView(
        child: ConstrainedBox(
          constraints: BoxConstraints(minHeight: viewportConstraints.maxHeight),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Center(
                child: Column(
                  children: [
                    FutureBuilder<List<CalendarEvent>>(
                      future: futureData,
                      builder: (context, snapshot) {
                        if (snapshot.hasData && snapshot.data!.isNotEmpty) {
                          print("${snapshot.data!.length}");
                          return Column(
                              children: snapshot.data!.map((e) {
                            List<Widget> headerWidgetList = [];
                            Widget? dateIndicator;

                            DateTime date = DateTime.parse(e.date);

                            int currentWeek = Jiffy.parseFromDateTime(DateTime.parse(e.date)).weekOfYear;

                            if (date.month != lastEventMonth) {
                              lastEventMonth = date.month;
                              headerWidgetList.add(
                                  // Card(
                                  //   color: theme.buttonTheme.colorScheme?.primaryContainer,
                                  //   child: Padding(
                                  //     padding: const EdgeInsets.fromLTRB(32, 32, 32, 32),
                                  //     child: Text(
                                  //       DateFormat("MMMM yyyy").format(date),
                                  //       style: TextStyle(
                                  //         color: theme.buttonTheme.colorScheme?.onPrimaryContainer,
                                  //         fontSize: theme.textTheme.headlineSmall?.fontSize,
                                  //       ),
                                  //     ),
                                  //   ),
                                  // ),
                                  SizedBox(
                                child: DecoratedBox(
                                  decoration: BoxDecoration(
                                    color: theme.buttonTheme.colorScheme?.primaryContainer,
                                  ),
                                  child: Padding(
                                    padding: const EdgeInsets.all(24.0),
                                    child: Text(
                                      DateFormat("MMMM yyyy").format(date),
                                      style: TextStyle(
                                        color: theme.buttonTheme.colorScheme?.onPrimaryContainer,
                                        fontSize: theme.textTheme.headlineSmall?.fontSize,
                                      ),
                                    ),
                                  ),
                                ),
                              ));
                            }

                            // add week indicator
                            if (currentWeek != lastEventWeek) {
                              lastEventWeek = currentWeek;

                              // find the start and end date of the week
                              DateFormat formatter = DateFormat("MMM d");
                              DateTime startOfWeek = date.subtract(Duration(days: date.weekday - 7));
                              DateTime endOfWeek = startOfWeek.add(Duration(days: 6));

                              headerWidgetList.add(
                                Padding(
                                  padding: EdgeInsets.only(top: 16, bottom: 12, left: 78),
                                  child: Text(
                                    "${formatter.format(startOfWeek)} - ${formatter.format(endOfWeek)}",
                                  ),
                                ),
                              );
                            } else if (headerWidgetList.length == 1) {
                              headerWidgetList.add(SizedBox(height: 24));
                            }

                            if (date.day != lastEventDay) {
                              lastEventDay = date.day;
                              bool isToday = Jiffy.parseFromDateTime(date).dayOfYear == Jiffy.parseFromDateTime(DateTime.now()).dayOfYear &&
                                  Jiffy.parseFromDateTime(date).year == Jiffy.parseFromDateTime(DateTime.now()).year;
                              dateIndicator = SizedBox(
                                width: 42,
                                height: 42,
                                child: DecoratedBox(
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.all(Radius.circular(69)),
                                    color: isToday ? theme.buttonTheme.colorScheme?.primary : Colors.transparent,
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.center,
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      SizedBox(
                                        height: 13,
                                        child: Text(
                                          DateFormat("EEE").format(date),
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: isToday ? theme.buttonTheme.colorScheme?.onPrimary : theme.textTheme.bodySmall?.color,
                                          ),
                                        ),
                                      ),
                                      SizedBox(
                                        height: 15,
                                        child: Text(
                                          "${date.day}",
                                          style: TextStyle(
                                            fontSize: 14,
                                            color: isToday ? theme.buttonTheme.colorScheme?.onPrimary : theme.textTheme.bodySmall?.color,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            }

                            return Padding(
                              padding: const EdgeInsets.only(bottom: 8),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                children: [
                                  (dateIndicator != null ? SizedBox(height: 24) : Container()),
                                  ...headerWidgetList,
                                  Padding(
                                    padding: const EdgeInsets.symmetric(horizontal: 16),
                                    child: Row(
                                      children: [
                                        (dateIndicator ?? SizedBox(width: 42)),
                                        SizedBox(width: 8),
                                        Expanded(
                                          child: Card.filled(
                                            child: Padding(
                                              padding: const EdgeInsets.all(8.0),
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                                children: [Text(e.name)],
                                              ),
                                            ),
                                          ),
                                        )
                                      ],
                                    ),
                                  )
                                ],
                              ),
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
                      },
                    )
                  ],
                ),
              ),
            ],
          ),
        ),
      );
    });
  }
}
