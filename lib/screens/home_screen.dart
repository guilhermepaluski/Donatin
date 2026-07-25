import 'package:donatin/theme/app_colors.dart';
import 'package:flutter/material.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text(
              'Olá, Guilherme! 👋',
              style: TextStyle(color: AppColors.black, fontSize: 22),
            ),
            Text(
              'Que bom ter você aqui!',
              style: TextStyle(color: AppColors.black, fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}
