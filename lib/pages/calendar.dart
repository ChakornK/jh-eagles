import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_widget_from_html_core/flutter_widget_from_html_core.dart';
import 'package:http/http.dart' as http;
import 'package:jiffy/jiffy.dart';
import 'package:intl/intl.dart';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';

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
    final List<ConnectivityResult> connectivityResult = await (Connectivity().checkConnectivity());
    final prefs = await SharedPreferences.getInstance();
    if (connectivityResult.contains(ConnectivityResult.none)) {
      final cache = prefs.getString("calendar_cache");
      if (cache == null || cache.isEmpty) {
        return [];
      }
      return (jsonDecode(cache) as List).map((d) => CalendarEvent.fromJson(d)).toList();
    }

    final response = await http.get(Uri.parse("https://eagletime.appazur.com/api/a?age=1&ua=1&v=2&dfmt=html"));

    isLoading = false;
    if (response.statusCode == 200 && response.body.isNotEmpty) {
      await prefs.setString("calendar_cache", response.body);
      // If the call to the server was successful, parse the JSON
      return (jsonDecode(response.body) as List).map((d) => CalendarEvent.fromJson(d)).toList();
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
      return Center(
        child: FutureBuilder<List<CalendarEvent>>(
          future: futureData,
          builder: (context, snapshot) {
            if (snapshot.hasData && snapshot.data!.isNotEmpty) {
              return RefreshIndicator(
                onRefresh: () => fetchData(),
                child: ListView(
                    children: snapshot.data!.map((e) {
                  List<Widget> headerWidgetList = [];
                  Widget? dateIndicator;

                  DateTime date = DateTime.parse(e.date);

                  int currentWeek = Jiffy.parseFromDateTime(DateTime.parse(e.date)).weekOfYear;

                  double totalHeight = (e.calMode == 1 ? 48 : 56);

                  if (date.month != lastEventMonth) {
                    lastEventMonth = date.month;
                    headerWidgetList.add(
                      Padding(
                        padding: (e.sid == snapshot.data![0].sid ? EdgeInsets.zero : EdgeInsets.only(top: 24.0)),
                        child: SizedBox(
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
                        ),
                      ),
                    );

                    totalHeight += (e.sid == snapshot.data![0].sid ? 90 : 128);
                  }

                  // add week indicator
                  if (currentWeek != lastEventWeek) {
                    lastEventWeek = currentWeek;

                    // find the start and end date of the week
                    DateFormat formatter = DateFormat("MMM d");
                    DateTime startOfWeek = date.subtract(Duration(days: date.weekday));
                    DateTime endOfWeek = startOfWeek.add(Duration(days: 6));

                    headerWidgetList.add(
                      Padding(
                        padding: EdgeInsets.only(top: 16, bottom: 12, left: 16),
                        child: Text(
                          "${formatter.format(startOfWeek)} - ${formatter.format(endOfWeek)}",
                          style: TextStyle(
                            fontSize: theme.textTheme.bodyLarge?.fontSize,
                          ),
                        ),
                      ),
                    );

                    totalHeight += 49;
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
                            Text(
                              DateFormat("EEE").format(date),
                              style: TextStyle(
                                fontSize: 12,
                                height: 1,
                                color: isToday ? theme.buttonTheme.colorScheme?.onPrimary : theme.textTheme.bodySmall?.color,
                              ),
                            ),
                            Text(
                              "${date.day}",
                              style: TextStyle(
                                fontSize: 14,
                                height: 1,
                                color: isToday ? theme.buttonTheme.colorScheme?.onPrimary : theme.textTheme.bodySmall?.color,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );

                    totalHeight += 2;

                    if (headerWidgetList.isEmpty) {
                      headerWidgetList.add(SizedBox(height: 16));
                      totalHeight += 14;
                    }
                  }

                  return Container(
                    height: totalHeight,
                    child: Padding(
                      padding: EdgeInsets.only(bottom: (e.calMode == 1) ? 0 : 8),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          ...headerWidgetList,
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            child: Row(
                              children: [
                                (dateIndicator ?? SizedBox(width: 42)),
                                SizedBox(width: 8),
                                Expanded(
                                  child: Card.filled(
                                    color: e.calMode == 1 ? Colors.transparent : theme.cardTheme.color,
                                    clipBehavior: Clip.antiAlias,
                                    child: InkWell(
                                      onTap: e.description.isEmpty
                                          ? null
                                          : () {
                                              showModalBottomSheet(
                                                context: context,
                                                showDragHandle: true,
                                                builder: (context) {
                                                  return Row(
                                                    children: [
                                                      Expanded(
                                                        child: SingleChildScrollView(
                                                          child: Padding(
                                                            padding: EdgeInsets.all(16),
                                                            child: HtmlWidget(
                                                              e.description,
                                                            ),
                                                          ),
                                                        ),
                                                      ),
                                                    ],
                                                  );
                                                },
                                              );
                                            },
                                      child: Padding(
                                        padding: (e.calMode == 1 ? EdgeInsets.only(left: 8.0) : EdgeInsets.all(8.0)),
                                        child: Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            Expanded(
                                              child: Text(
                                                e.name,
                                                maxLines: 1,
                                                softWrap: false,
                                                style: (e.calMode == 1 ? TextStyle(fontSize: 18.0, overflow: TextOverflow.ellipsis) : null),
                                              ),
                                            ),
                                            SizedBox(
                                              width: 24,
                                              height: 24,
                                              child: (e.description.isEmpty ? Container() : Icon(Icons.chevron_right_outlined)),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ),
                                )
                              ],
                            ),
                          )
                        ],
                      ),
                    ),
                  );
                }).toList()),
              );
            } else if (snapshot.hasData && snapshot.data!.isEmpty && !isLoading) {
              return Container(
                height: 300,
                child: Column(
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
                ),
              );
            }

            // By default, show a loading spinner.
            return const CircularProgressIndicator();
          },
        ),
      );
    });
  }
}
