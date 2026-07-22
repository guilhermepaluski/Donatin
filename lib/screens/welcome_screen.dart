import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';
import '../widgets/pill_button.dart';
import '../widgets/floating_emojis_background.dart';
import 'signup_screen.dart';

class WelcomeScreen extends StatefulWidget {
  const WelcomeScreen({super.key});

  @override
  State<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends State<WelcomeScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  // Altura da faixa verde visível no topo, antes do card branco começar.
  static const double _greenHeaderHeight = 170;
  static const double _logoSize = 140;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.darkGreen,
      body: SafeArea(
        bottom: false,
        child: Stack(
          children: [
            // Camada de base: faixa verde no topo + card branco preenchendo o resto.
            Column(
              children: [
                const SizedBox(height: _greenHeaderHeight),
                Expanded(
                  child: ClipRRect(
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(32),
                      topRight: Radius.circular(32),
                    ),
                    child: Stack(
                      children: [
                        // Emojis flutuando de fundo, dentro do card branco.
                        Container(color: AppColors.white),
                        const Positioned.fill(
                          child: FloatingEmojisBackground(
                            emojis: ['💚', '🧸', '🎁'],
                            count: 10,
                          ),
                        ),
                        SingleChildScrollView(
                          padding: const EdgeInsets.fromLTRB(28, 72, 28, 24),
                          child: Column(
                            children: [
                              Text(
                                'Donatin',
                                style: AppTextStyles.appTitle,
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 3),
                              Text(
                                'Pequenos gestos,\ngrandes transformações.',
                                style: AppTextStyles.subtitle,
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 32),
                              TextField(
                                controller: _emailController,
                                keyboardType: TextInputType.emailAddress,
                                decoration: InputDecoration(
                                  labelText: 'E-mail',
                                  hintText: 'example@email.com',
                                  prefixIcon: const Icon(Icons.email),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12.0),
                                  ),
                                  filled: true,
                                  fillColor: Colors.white,
                                ),
                              ),
                              const SizedBox(height: 16),
                              TextField(
                                controller: _passwordController,
                                keyboardType: TextInputType.visiblePassword,
                                decoration: InputDecoration(
                                  labelText: 'Password',
                                  hintText: '***',
                                  prefixIcon: const Icon(
                                    Icons.password_outlined,
                                  ),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12.0),
                                  ),
                                  filled: true,
                                  fillColor: Colors.white,
                                ),
                              ),
                              const SizedBox(height: 16),
                              PillButton(
                                label: 'Sign in',
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
                              const SizedBox(height: 20),
                              const _OrDivider(),
                              const SizedBox(height: 20),
                              const _SocialLoginRow(),
                              const SizedBox(height: 20),
                              const _NativeSignUp(),
                              const SizedBox(height: 24),
                              const _TermsText(),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            // Logo sobreposto na costura entre o verde e o branco.
            Positioned(
              top: _greenHeaderHeight - (_logoSize / 2),
              left: 0,
              right: 0,
              child: const Center(child: _Logo()),
            ),
          ],
        ),
      ),
    );
  }
}

class _Logo extends StatelessWidget {
  const _Logo();

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

class _OrDivider extends StatelessWidget {
  const _OrDivider();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(child: Divider(color: Colors.grey[400], thickness: 1)),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Text(
            'or sign in with',
            style: TextStyle(color: Colors.grey[600], fontSize: 13),
          ),
        ),
        Expanded(child: Divider(color: Colors.grey[400], thickness: 1)),
      ],
    );
  }
}

class _SocialLoginRow extends StatelessWidget {
  const _SocialLoginRow();

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        _SocialIconButton(
          icon: const Icon(Icons.apple, size: 28, color: Colors.black),
          onTap: () {
            // TODO: implementar login com Apple
          },
        ),
        const SizedBox(width: 24),
        _SocialIconButton(
          icon: Image.asset('assets/images/google_icon.png', width: 28),
          onTap: () {
            // TODO: implementar login com Google
          },
        ),
      ],
    );
  }
}

class _SocialIconButton extends StatelessWidget {
  final Widget icon;
  final VoidCallback onTap;

  const _SocialIconButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      customBorder: const CircleBorder(),
      child: Container(
        width: 56,
        height: 56,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(color: Colors.grey[300]!),
        ),
        child: icon,
      ),
    );
  }
}

class _NativeSignUp extends StatelessWidget {
  const _NativeSignUp();

  @override
  Widget build(BuildContext context) {
    return RichText(
      textAlign: TextAlign.center,
      text: TextSpan(
        style: const TextStyle(fontSize: 16, color: Colors.black),
        children: [
          const TextSpan(text: "Don't you have an account? "),
          TextSpan(
            text: 'Sign up',
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: AppColors.primaryGreen,
            ),
            recognizer: TapGestureRecognizer()
              ..onTap = () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) => const SignUpScreen(),
                  ),
                );
              },
          ),
        ],
      ),
    );
  }
}

class _TermsText extends StatelessWidget {
  const _TermsText();

  @override
  Widget build(BuildContext context) {
    return RichText(
      textAlign: TextAlign.center,
      text: TextSpan(
        style: TextStyle(fontSize: 12, color: Colors.grey[600]),
        children: const [
          TextSpan(text: 'By continuing, you agree to Donatin\'s\n'),
          TextSpan(
            text: 'Terms',
            style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black),
          ),
          TextSpan(text: ' & '),
          TextSpan(
            text: 'Conditions',
            style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black),
          ),
          TextSpan(text: ' & '),
          TextSpan(
            text: 'Privacy Policy',
            style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black),
          ),
        ],
      ),
    );
  }
}
