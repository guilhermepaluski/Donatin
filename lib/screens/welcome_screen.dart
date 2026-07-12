import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';
import '../widgets/pill_button.dart';
import '../widgets/floating_emojis_background.dart';
import 'login_screen.dart';
import 'signup_screen.dart';

/// Primeira tela exibida ao abrir o app pela primeira vez.
/// Apresenta a marca Donatin e dá acesso a Criar conta / Entrar.
class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Faixa verde médio que aparece "atrás" do card escuro
      backgroundColor: AppColors.darkGreen,
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            // Pequeno respiro para a faixa verde aparecer no topo,
            // como no design original.
            const SizedBox(height: 15),
            Expanded(
              child: SizedBox(
                width: double.infinity,
                child: ClipRRect(
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(32),
                    topRight: Radius.circular(32),
                  ),
                  child: Stack(
                    children: [
                      // Camada de fundo: emojis flutuando suavemente.
                      // Positioned.fill garante que ela ocupe todo o
                      // card, mesmo o LayoutBuilder interno recalculando
                      // só essa área (não a tela toda).
                      const Positioned.fill(
                        child: FloatingEmojisBackground(
                          emojis: ['💚','🧸'],
                          count: 10,
                        ),
                      ),
                      // Camada de conteúdo principal, por cima dos emojis.
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 28),
                        child: Column(
                          children: [
                            const SizedBox(height: 64),
                            _Logo(),
                            const SizedBox(height: 28),
                            Text(
                              'Donatin',
                              style: AppTextStyles.appTitle,
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 12),
                            Text(
                              'Pequenos gestos,\ngrandes afetos.',
                              style: AppTextStyles.subtitle,
                              textAlign: TextAlign.center,
                            ),
                            const Spacer(),
                            PillButton(
                              label: 'Criar conta',
                              textStyle: AppTextStyles.buttonTextLight,
                              backgroundColor: AppColors.primaryGreen,
                              onPressed: () {
                                Navigator.of(context).push(
                                  MaterialPageRoute(
                                    builder: (_) => const SignUpScreen(),
                                  ),
                                );
                              },
                            ),
                            const SizedBox(height: 16),
                            PillButton(
                              label: 'Entrar',
                              textStyle: AppTextStyles.buttonTextDark,
                              backgroundColor: AppColors.white,
                              onPressed: () {
                                Navigator.of(context).push(
                                  MaterialPageRoute(
                                    builder: (_) => const LoginScreen(),
                                  ),
                                );
                              },
                            ),
                            const SizedBox(height: 32),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Logo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 140,
      height: 140,
      decoration: const BoxDecoration(
        color: AppColors.white,
        shape: BoxShape.circle,
      ),
      child: const Padding(
        padding: EdgeInsets.all(28.0),
        child: Icon(
          Icons.volunteer_activism,
          color: AppColors.primaryGreen,
          size: 64,
        ),
      ),
    );
  }
}
