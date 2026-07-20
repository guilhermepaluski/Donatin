import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';
import '../widgets/pill_button.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _birthDateController = TextEditingController();
  final _cpfcnpjController = TextEditingController();
  final _cepController = TextEditingController();
  final _streetController = TextEditingController();
  final _neighborController = TextEditingController();
  final _numberController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _birthDateController.dispose();
    _cpfcnpjController.dispose();
    _cepController.dispose();
    _streetController.dispose();
    _neighborController.dispose();
    _numberController.dispose();
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
        title: const Text(
          'Criar conta',
          style: TextStyle(color: AppColors.white),
        ),
      ),
      body: ListView(
        children: [
          TextField(
            controller: _nameController,
            decoration: InputDecoration(
              labelText: 'Nome/Razão social',
              hintText: 'Digite o nome',
              prefixIcon: Icon(Icons.person),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12.0),
              ),
              filled: true,
              fillColor: Colors.white,
            ),
          ),
          const SizedBox(height: 16),

          TextField(
            controller: _emailController,
            decoration: InputDecoration(
              labelText: 'E-mail',
              hintText: 'Digite seu e-mail',
              prefixIcon: Icon(Icons.email),
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
            obscureText: true,
            decoration: InputDecoration(
              labelText: 'Senha',
              hintText: 'Digite a senha',
              prefixIcon: Icon(Icons.password),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12.0),
              ),
              filled: true,
              fillColor: Colors.white,
            ),
          ),
          const SizedBox(height: 16),

          TextField(
            controller: _birthDateController,
            decoration: InputDecoration(
              labelText: 'Data de nascimento/fundação',
              hintText: 'DD/MM/AAAA',
              prefixIcon: Icon(Icons.date_range),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12.0),
              ),
              filled: true,
              fillColor: Colors.white,
            ),
          ),
          const SizedBox(height: 16),

          TextField(
            controller: _cpfcnpjController,
            decoration: InputDecoration(
              labelText: 'CPF/CNPJ',
              hintText: 'Digite o CPF/CNPJ',
              prefixIcon: Icon(Icons.document_scanner),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12.0),
              ),
              filled: true,
              fillColor: Colors.white,
            ),
          ),
          const SizedBox(height: 16),

          TextField(
            controller: _cepController,
            decoration: InputDecoration(
              labelText: 'CEP',
              hintText: 'Digite o CEP',
              prefixIcon: Icon(Icons.house),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12.0),
              ),
              filled: true,
              fillColor: Colors.white,
            ),
          ),
          const SizedBox(height: 16),

          TextField(
            controller: _streetController,
            decoration: InputDecoration(
              labelText: 'Rua',
              hintText: 'Digite a rua',
              prefixIcon: Icon(Icons.streetview),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12.0),
              ),
              filled: true,
              fillColor: Colors.white,
            ),
          ),
          const SizedBox(height: 16),

          TextField(
            controller: _neighborController,
            decoration: InputDecoration(
              labelText: 'Bairro',
              hintText: 'Digite o bairro',
              prefixIcon: Icon(Icons.stream_outlined),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12.0),
              ),
              filled: true,
              fillColor: Colors.white,
            ),
          ),
          const SizedBox(height: 16),
          
          TextField(
            controller: _numberController,
            decoration: InputDecoration(
              labelText: 'Número',
              hintText: 'Digite o número',
              prefixIcon: Icon(Icons.numbers),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12.0),
              ),
              filled: true,
              fillColor: Colors.white,
            ),
          ),
          const SizedBox(height: 24),
          
          Padding(padding: const EdgeInsets.symmetric(horizontal: 28),
            child: PillButton(
              label: 'Criar',
              textStyle: AppTextStyles.buttonTextLight,
              backgroundColor: AppColors.primaryGreen,
              icon: Icons.person_add,
              onPressed: () {
                print('Nome ${_nameController.text}');
                print('E-mail ${_emailController.text}');
              },
            ),
          )
        ],
      ),
    );
  }
}
