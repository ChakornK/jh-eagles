import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:url_launcher/url_launcher.dart';

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

  final browser = ChromeSafariBrowser();

  @override
  void initState() {
    super.initState();
    futureData = fetchData();
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (BuildContext context, BoxConstraints viewportConstraints) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Card(
                shadowColor: Color(0x00FFFFFF),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][DateTime.now().weekday - 1]} ${[
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
                        ][DateTime.now().month - 1]} ${DateTime.now().day}, ${DateTime.now().year}",
                        textScaler: TextScaler.linear(1.2),
                      ),
                      FutureBuilder<HomeData>(
                          future: futureData,
                          builder: (context, snapshot) {
                            return Column(
                              children: [
                                Text(
                                  (snapshot.data?.blockRotation.toString() ?? "N/A"),
                                  textScaler: TextScaler.linear(1.7),
                                ),
                              ],
                            );
                          })
                    ],
                  ),
                ),
              ),
              SizedBox(height: 8),
              Expanded(
                  child: Card(
                      clipBehavior: Clip.antiAlias,
                      shadowColor: Color(0x00FFFFFF),
                      child: SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            {
                              "index": 0,
                              "title": "Website",
                              "subtitle": "surreyschools.ca/johnht",
                              "link": "https://www.surreyschools.ca/johnht/",
                              "icon": Icons.public_outlined
                            },
                            {
                              "index": 1,
                              "title": "MyEdBC",
                              "subtitle": "Check grades, schedule, and view report cards",
                              "link": "https://myeducation.gov.bc.ca/aspen/logon.do",
                              "icon": Icons.school_outlined
                            },
                            {
                              "index": 2,
                              "title": "School Cash Online",
                              "subtitle": "Pay school fees",
                              "link": "https://www.schoolcashonline.com/",
                              "icon": Icons.payments_outlined
                            },
                            {
                              "index": 3,
                              "title": "Counsellor Appointments",
                              "subtitle": "Book an appointment online",
                              "link": "https://jh.counsellorappointments.com/",
                              "icon": Icons.calendar_month_outlined
                            },
                            {
                              "index": 4,
                              "title": "Locker Assignments",
                              "subtitle": "Register and choose a locker. Student ID# required",
                              "link": "https://jh.lockerassignment.com",
                              "icon": Icons.lock_outline
                            },
                            {
                              "index": 5,
                              "title": "Bell Schedule",
                              "subtitle": "Regular, Late Start Tuesday and Early Dismissal",
                              "link": "https://eagletime.appazur.com/media/info/eagletime/JH_bells_and_blocks_2023-24_WtvSI0Z.pdf",
                              "icon": Icons.schedule_outlined
                            },
                            {
                              "index": 6,
                              "title": "School Map",
                              "subtitle": "Level 1 / Level 2",
                              "link": "https://eagletime.appazur.com/media/info/eagletime/map_JH_2019_.jpg_CvI94vg.png",
                              "icon": Icons.map_outlined
                            },
                            {"index": 7, "title": "Phone", "subtitle": "(604) 581-5500", "link": "tel:+16045815500", "icon": Icons.phone_outlined},
                            {
                              "index": 8,
                              "title": "Email",
                              "subtitle": "johnstonheights@surreyschools.ca",
                              "link": "mailto:johnstonheights@surreyschools.ca",
                              "icon": Icons.email_outlined
                            },
                            {
                              "index": 9,
                              "title": "Map / Directions",
                              "subtitle": "15350 - 99th Avenue, Surrey, BC V3R 0R9",
                              "link": "https://goo.gl/maps/K8cF7KdCun4r6RV89",
                              "icon": Icons.place_outlined
                            },
                            {
                              "index": 10,
                              "title": "Student Accident Insurance",
                              "subtitle": "How to purchase student accident insurance",
                              "link": "https://eagletime.appazur.com/media/info/eagletime/2021-2022_Student_Accident_-_newsletter_schools_wording_937zRqp.pdf",
                              "icon": Icons.medical_services_outlined
                            },
                            {
                              "index": 11,
                              "title": "Insure My Kids",
                              "subtitle": "",
                              "link": "https://insuremykids.com/",
                              "icon": Icons.medical_services_outlined
                            },
                            {
                              "index": 12,
                              "title": "StudyInsured Student Accident Insurance",
                              "subtitle": "",
                              "link": "https://www.studyinsuredstudentaccident.com/",
                              "icon": Icons.medical_services_outlined
                            },
                          ]
                              .map((e) => (Column(
                                    children: [
                                      (e["index"] != 0)
                                          ? Divider(
                                              thickness: 0.5,
                                              height: 1,
                                            )
                                          : Container(),
                                      InkWell(
                                          onTap: () async {
                                            var uri = WebUri(e["link"] as String);

                                            if (!["http", "https", "file", "chrome", "data", "javascript", "about"].contains(uri.scheme)) {
                                              if (await canLaunchUrl(uri)) {
                                                await launchUrl(
                                                  uri,
                                                );
                                              }
                                            } else {
                                              await browser.open(url: uri);
                                            }
                                          },
                                          child: Padding(
                                            padding: const EdgeInsets.all(16.0),
                                            child: Row(children: [
                                              Icon(e["icon"] as IconData, size: 24),
                                              SizedBox(width: 16),
                                              Flexible(
                                                  child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                mainAxisAlignment: MainAxisAlignment.center,
                                                children: [
                                                  (e["title"] != "") ? Text(e["title"] as String, textScaler: TextScaler.linear(1.25)) : Container(),
                                                  (e["subtitle"] != "") ? Text(e["subtitle"] as String, textScaler: TextScaler.linear(0.9)) : Container(),
                                                ],
                                              ))
                                            ]),
                                          )),
                                    ],
                                  )))
                              .toList(),
                        ),
                      ))),
            ],
          ),
        ),
      );
    });
  }
}
