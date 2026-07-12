import 'package:flutter/material.dart';
import 'screens/welcome_screen.dart';

void main() {
  runApp(const DonatinApp());
}

class DonatinApp extends StatelessWidget {
  const DonatinApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Donatin',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        fontFamily: 'Poppins',
        useMaterial3: true,
      ),
      home: const WelcomeScreen(),
    );
  } 
}