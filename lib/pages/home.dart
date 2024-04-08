import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class HomeData {
  String blockRotation;

  HomeData({required this.blockRotation});

  factory HomeData.fromJson(Map<String, dynamic> json) {
    return HomeData(blockRotation: json['name'].toString());
  }
}

class HomePage extends StatefulWidget {
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late Future<HomeData> futureData;

  Future<HomeData> fetchData() async {
    final response = await http.get(Uri.parse("https://eagletime.vercel.app/block"));

    if (response.statusCode == 200 && response.body.isNotEmpty) {
      var lst = jsonDecode(response.body) as List;
      return HomeData.fromJson(lst[0]);
    } else {
      return HomeData(blockRotation: "N/A");
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
            children: [
              Center(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text("${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][DateTime.now().weekday - 1]} ${[
                                "January",
                                "February",
                                "March",
                                "April",
                                "May",
                                "June",
                                "July",
                                "August",
                                "September",
                                "October",
                                "November",
                                "December"
                              ][DateTime.now().month - 1]} ${DateTime.now().day}, ${DateTime.now().year}"),
                              FutureBuilder<HomeData>(
                                future: futureData,
                                builder: (context, snapshot) {
                                  if (snapshot.hasData && snapshot.data!.blockRotation.isNotEmpty) {
                                    return Column(
                                      children: [
                                        Text(
                                          snapshot.data!.blockRotation.toString(),
                                          textScaler: TextScaler.linear(1.5),
                                        ),
                                      ],
                                    );
                                  } else {
                                    return Text(
                                      "N/A",
                                      textScaler: TextScaler.linear(1.5),
                                    );
                                  }
                                },
                              )
                            ],
                          ),
                        ),
                      )
                    ],
                  ),
                ),
              )
            ],
          ),
        ),
      );
    });
  }
}
