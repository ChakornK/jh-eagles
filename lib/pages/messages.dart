import 'dart:collection';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:cached_network_image/cached_network_image.dart';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Message {
  int sid;
  int timestamp;
  String date;
  String fname;
  int notify;
  String icon;
  String url;
  String text;
  List atts;

  Message({
    required this.sid,
    required this.timestamp,
    required this.date,
    required this.fname,
    required this.notify,
    required this.icon,
    required this.url,
    required this.text,
    required this.atts,
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      sid: json['sid'] ?? 0,
      timestamp: json['timestamp'] ?? 0,
      date: json['date']?.toString() ?? "",
      fname: json['fname']?.toString() ?? "",
      notify: json['notify'] ?? 0,
      icon: json['icon']?.toString() ?? "",
      url: json['url']?.toString() ?? "",
      text: json['text']?.toString() ?? "",
      atts: json['atts'] ?? [],
    );
  }
}

class MessagesPage extends StatefulWidget {
  @override
  State<MessagesPage> createState() => _MessagesPageState();
}

// ignore: must_be_immutable
class _MessagesPageState extends State<MessagesPage> {
  late Future<List<Message>> futureMessages;
  bool isLoading = true;

  Future<List<Message>> fetchMessages() async {
    final List<ConnectivityResult> connectivityResult = await (Connectivity().checkConnectivity());
    final prefs = await SharedPreferences.getInstance();
    if (connectivityResult.contains(ConnectivityResult.none)) {
      final cache = prefs.getString("messages_cache");
      if (cache == null || cache.isEmpty) {
        return [];
      }
      return (jsonDecode(cache) as List).map((d) => Message.fromJson(d)).toList();
    }

    final response = await http.get(Uri.parse("https://eagletime.appazur.com/api/msg?limit=50"));

    isLoading = false;
    if (response.statusCode == 200 && response.body.isNotEmpty) {
      await prefs.setString("messages_cache", response.body);
      // If the call to the server was successful, parse the JSON
      return (jsonDecode(response.body) as List).map((d) => Message.fromJson(d)).toList();
    } else {
      return [];
    }
  }

  final browser = ChromeSafariBrowser();

  @override
  void initState() {
    super.initState();
    futureMessages = fetchMessages();
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (BuildContext context, BoxConstraints viewportConstraints) {
      return RefreshIndicator(
        onRefresh: () => fetchMessages(),
        child: SingleChildScrollView(
          child: ConstrainedBox(
            constraints: BoxConstraints(minHeight: viewportConstraints.maxHeight),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Center(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        FutureBuilder<List<Message>>(
                          future: futureMessages,
                          builder: (context, snapshot) {
                            if (snapshot.hasData && snapshot.data!.isNotEmpty) {
                              return Column(
                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                children: snapshot.data!
                                    .map((e) => Card(
                                        shadowColor: Color(0x00FFFFFF),
                                        margin: EdgeInsets.fromLTRB(0, 0, 0, 16),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                        elevation: 2,
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Builder(builder: (context) {
                                              if (e.atts.isNotEmpty) {
                                                return ClipRRect(
                                                  borderRadius: BorderRadius.only(
                                                      topLeft: Radius.circular(8),
                                                      topRight: Radius.circular(8),
                                                      bottomLeft: Radius.circular(4),
                                                      bottomRight: Radius.circular(4)),
                                                  child: CachedNetworkImage(
                                                      imageUrl: e.atts[0]["url"],
                                                      width: MediaQuery.of(context).size.width,
                                                      height: (MediaQuery.of(context).size.width / e.atts[0]["x"] * (e.atts[0]["y"] - 64)).floorToDouble(),
                                                      fit: BoxFit.cover),
                                                );
                                              } else {
                                                return Container();
                                              }
                                            }),
                                            Padding(
                                              padding: const EdgeInsets.all(16.0),
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Text(
                                                    e.text.replaceAll(RegExp(r"(\r|\n)+"), "\n").split("\n")[0],
                                                    textScaler: TextScaler.linear(1.25),
                                                  ),
                                                  Text(
                                                    e.date,
                                                    textScaler: TextScaler.linear(0.85),
                                                  ),
                                                  Builder(builder: (context) {
                                                    if (e.text.split("\n").length > 1) {
                                                      return Column(children: [
                                                        SizedBox(
                                                          height: 12,
                                                        ),
                                                        Text(
                                                          e.text.replaceAll(RegExp(r"(\r|\n)+"), "\n").split("\n").sublist(1).join("\n").trim(),
                                                        ),
                                                      ]);
                                                    } else {
                                                      return Container();
                                                    }
                                                  }),
                                                  Builder(builder: (context) {
                                                    if (e.url != "null") {
                                                      return Padding(
                                                        padding: const EdgeInsets.fromLTRB(0, 8, 0, 0),
                                                        child: Container(
                                                          alignment: Alignment.centerLeft,
                                                          child: FilledButton.tonal(
                                                              onPressed: () {
                                                                showModalBottomSheet(
                                                                    isScrollControlled: true,
                                                                    useSafeArea: true,
                                                                    showDragHandle: true,
                                                                    enableDrag: false,
                                                                    context: context,
                                                                    builder: (context) {
                                                                      return Center(
                                                                        child: Column(
                                                                          children: [
                                                                            Expanded(
                                                                                child: InAppWebView(
                                                                                    initialUrlRequest: URLRequest(url: WebUri(e.url.toString())),
                                                                                    initialUserScripts: UnmodifiableListView([
                                                                                      UserScript(source: """
																										const themeInterval = setInterval(() => {
																											if (document.getElementById('customStyle')) {
																												clearInterval(themeInterval);
																												return;
																											}
																											const customStyle = document.createElement('style');
																											customStyle.id = 'customStyle';
																											customStyle.innerHTML = `
																												body {
																													background: #${Theme.of(context).colorScheme.surface.value.toRadixString(16).substring(2)} !important;
																													color: #${Theme.of(context).colorScheme.onSurface.value.toRadixString(16).substring(2)} !important;
																												}
																												* {
																													max-width: ${MediaQuery.of(context).size.width}px;
																													height: auto;
																												}
																												p, p * {
																													color: #${Theme.of(context).colorScheme.onSurface.value.toRadixString(16).substring(2)} !important;
																												}
																												a, a * {
																													color: #${Theme.of(context).colorScheme.primary.value.toRadixString(16).substring(2)} !important;
																												}
																												span {
																													background: none !important;
																												}
																												table {
																													background: #${Theme.of(context).colorScheme.surface.value.toRadixString(16).substring(2)} !important;
																												}
																											`;
																											document.body.appendChild(customStyle);
																										}, 20)
																										""", injectionTime: UserScriptInjectionTime.AT_DOCUMENT_START)
                                                                                    ]),
                                                                                    shouldOverrideUrlLoading: (controller, navigationAction) async {
                                                                                      var uri = navigationAction.request.url!;

                                                                                      if (!["http", "https", "file", "chrome", "data", "javascript", "about"]
                                                                                          .contains(uri.scheme)) {
                                                                                        if (await canLaunchUrl(uri)) {
                                                                                          await launchUrl(
                                                                                            uri,
                                                                                          );
                                                                                        }
                                                                                      } else {
                                                                                        browser.open(url: uri);
                                                                                        Navigator.pop(context);
                                                                                      }
                                                                                      return NavigationActionPolicy.CANCEL;
                                                                                    }))
                                                                          ],
                                                                        ),
                                                                      );
                                                                    });
                                                              },
                                                              child: Text("Read more")),
                                                        ),
                                                      );
                                                    } else {
                                                      return Container();
                                                    }
                                                  }),
                                                ],
                                              ),
                                            ),
                                          ],
                                        )))
                                    .toList(),
                              );
                            } else if (snapshot.hasData && snapshot.data!.isEmpty && !isLoading) {
                              return Column(
                                mainAxisSize: MainAxisSize.max,
                                children: [
                                  Text('${snapshot.error ?? "Failed to load data"}'),
                                  SizedBox(height: 10),
                                  FilledButton.tonalIcon(
                                    onPressed: () {
                                      isLoading = true;
                                      futureMessages = fetchMessages();
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
                ),
              ],
            ),
          ),
        ),
      );
    });
  }
}
