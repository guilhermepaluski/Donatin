import 'package:flutter/material.dart';
import 'app_colors.dart';

/// Estilos de texto reutilizáveis do app Donatin.
class AppTextStyles {
  AppTextStyles._();

  static const TextStyle appTitle = TextStyle(
    fontSize: 40,
    fontWeight: FontWeight.w800,
    color: AppColors.primaryGreen,
  );

  static const TextStyle subtitle = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w500,
    color: AppColors.black,
    height: 1.3,
  );

  static const TextStyle buttonTextLight = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w700,
    color: AppColors.white,
  );

  static const TextStyle buttonTextDark = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w700,
    color: AppColors.black,
  );
}
