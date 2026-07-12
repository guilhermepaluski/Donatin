import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

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
            decoration: const InputDecoration(
              labelText: 'Nome/Razão social',
              hintText: 'Digite o nome',
              prefixIcon: const Icon(Icons.person),
              border: const OutlineInputBorder(),
              filled: true,
              fillColor: Colors.white,
            ),
          ),
          const SizedBox(height: 16),

          TextField(
            controller: _emailController,
            decoration: const InputDecoration(
              labelText: 'E-mail',
              hintText: 'Digite seu e-mail',
              prefixIcon: const Icon(Icons.email),
              border: const OutlineInputBorder(),
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
              prefixIcon: const Icon(Icons.password),
              border: const OutlineInputBorder(),
              filled: true,
              fillColor: Colors.white,
            ),
          ),
          const SizedBox(height: 16),

          TextField(
            controller: _birthDateController,
            decoration: const InputDecoration(
              labelText: 'Data de nascimento/fundação',
              hintText: 'DD/MM/AAAA',
              prefixIcon: const Icon(Icons.date_range),
              border: const OutlineInputBorder(),
              filled: true,
              fillColor: Colors.white,
            ),
          ),
          const SizedBox(height: 16),

          TextField(
            controller: _cpfcnpjController,
            decoration: const InputDecoration(
              labelText: 'CPF/CNPJ',
              hintText: 'Digite o CPF/CNPJ',
              prefixIcon: const Icon(Icons.document_scanner),
              border: const OutlineInputBorder(),
              filled: true,
              fillColor: Colors.white,
            ),
          ),
          const SizedBox(height: 16),

          TextField(
            controller: _cepController,
            decoration: const InputDecoration(
              labelText: 'CEP',
              hintText: 'Digite o CEP',
              prefixIcon: const Icon(Icons.house),
              border: const OutlineInputBorder(),
              filled: true,
              fillColor: Colors.white,
            ),
          ),
          const SizedBox(height: 16),

          TextField(
            controller: _streetController,
            decoration: const InputDecoration(
              labelText: 'Rua',
              hintText: 'Digite a rua',
              prefixIcon: const Icon(Icons.streetview),
              border: const OutlineInputBorder(),
              filled: true,
              fillColor: Colors.white,
            ),
          ),
          const SizedBox(height: 16),

          TextField(
            controller: _neighborController,
            decoration: const InputDecoration(
              labelText: 'Bairro',
              hintText: 'Digite o bairro',
              prefixIcon: const Icon(Icons.stream_outlined),
              border: const OutlineInputBorder(),
              filled: true,
              fillColor: Colors.white,
            ),
          ),
          const SizedBox(height: 16),

          TextField(
            controller: _numberController,
            decoration: const InputDecoration(
              labelText: 'Número',
              hintText: 'Digite o número',
              prefixIcon: const Icon(Icons.numbers),
              border: const OutlineInputBorder(),
              filled: true,
              fillColor: Colors.white,
            ),
          ),
          const SizedBox(height: 24),

          ElevatedButton(
            onPressed: () {
              print('Nome ${_nameController.text}');
              print('E-mail ${_emailController.text}');
            },
            child: const Text('Criar'),
          ),
        ],
      ),
    );
  }
}
