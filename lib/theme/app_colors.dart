import 'package:flutter/material.dart';

/// Paleta de cores do app Donatin, extraída do design no Figma.
/// Centralizar aqui evita "magic numbers" de cor espalhados pelas telas.
class AppColors {
  AppColors._();

  // Verde médio - usado na faixa superior, título e botão primário
  static const Color primaryGreen = Color(0xFF5A9159);

  // Verde escuro - fundo principal das telas com tema escuro
  static const Color darkGreen = Color(0xFF13301F);

  // Branco - botão secundário e textos sobre fundo escuro
  static const Color white = Colors.white;

  // Preto - texto sobre o botão branco
  static const Color black = Colors.black;
}
