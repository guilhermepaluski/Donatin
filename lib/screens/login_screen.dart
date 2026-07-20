import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';
import 'package:donatin/widgets/pill_button.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

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
      appBar: AppBar(
        backgroundColor: AppColors.darkGreen,
        elevation: 0,
        iconTheme: const IconThemeData(color: AppColors.white),
        title: const Text('Entrar', style: TextStyle(color: AppColors.white)),
      ),
      body: ListView(
        children: [
          TextField(
            controller: _emailController,
            decoration: const InputDecoration(
              labelText: 'E-mail',
              hintText: 'Digite seu e-mail',
              prefixIcon: Icon(Icons.email),
              border: OutlineInputBorder(),
              filled: true,
              fillColor: Colors.white,
            ),
          ),
          const SizedBox(height: 16),

          TextField(
            controller: _passwordController,
            obscureText: true,
            decoration: const InputDecoration(
              labelText: 'Senha',
              hintText: 'Digite a senha',
              prefixIcon: Icon(Icons.password),
              border: OutlineInputBorder(),
              filled: true,
              fillColor: Colors.white,
            ),
          ),
          const SizedBox(height: 24),

          Padding(padding: const EdgeInsets.symmetric(horizontal: 28),
            child: PillButton(
              label: 'Entrar',
              textStyle: AppTextStyles.buttonTextDark,
              backgroundColor: Colors.white,
              onPressed: () {
                print('E-mail ${_emailController.text}');
              },
            ),
          )
        ],
      ),
    );
  }
}
