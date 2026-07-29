import 'package:donatin/theme/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:donatin/widgets/category_cart.dart';

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
        toolbarHeight: 70,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text(
              'Olá, Guilherme! 👋',
              style: TextStyle(
                color: AppColors.black,
                fontSize: 20,
                fontWeight: FontWeight.bold
              ),
            ),
            SizedBox(height: 4),
            Text(
              'Que bom ter você aqui!',
              style: TextStyle(
                color: Color.fromARGB(255, 116, 116, 116),
                fontSize: 14,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none, color: AppColors.black, size: 28),
            onPressed: () {
              // ADICIONAR A LÓGICA DO BOTÃO DE NOTIFICAÇÕES AQUI!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // === CAMPO DE BUSCA DE CAMPANHAS ===
            TextField(
              decoration: InputDecoration(
                hintText: 'Buscar campanhas',
                hintStyle: const TextStyle(color: Colors.grey, fontSize: 15),
                prefixIcon: const Icon(Icons.search, color: Colors.grey),
                filled: true,
                fillColor: const Color(0xFFF2F2F2),
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 24),

            // === CATEGORIAS ===
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Categorias',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppColors.black,
                  )
                ),
                TextButton(
                  onPressed: () {
                    // LÓGICA DO BOTÃO DE VER TODAS AS CATEGORIAS AO SER CLICADO
                  },
                  child: const Text(
                    'Ver todas',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppColors.darkLightGreen,
                    )
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            // --- LISTA HORIZONTAL DAS CATEGORIAS ---
            SizedBox(
              height: 90,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  CategoryCard(
                    categoryTitle: 'Animais',
                    categoryIcon: Icons.pets_outlined,
                    categoryIconColor: Colors.orange,
                    categoryBgColor: const Color(0xFFFFF3E0),
                  ),
                  CategoryCard(
                    categoryTitle: 'Educação',
                    categoryIcon: Icons.school,
                    categoryIconColor: Colors.lightBlue,
                    categoryBgColor: const Color(0xE3E1F5FE),
                  ),
                  CategoryCard(
                    categoryTitle: 'Roupas',
                    categoryIcon: Icons.checkroom,
                    categoryIconColor: Colors.purple,
                    categoryBgColor: const Color(0xE2FEE1FD),
                  ),
                  CategoryCard(
                    categoryTitle: 'Higiene',
                    categoryIcon: Icons.shower,
                    categoryIconColor: Colors.lightGreen,
                    categoryBgColor: const Color(0xFFE8F5E9),
                  ),
                  CategoryCard(
                    categoryTitle: 'Lazer',
                    categoryIcon: Icons.extension,
                    categoryIconColor: Colors.redAccent,
                    categoryBgColor: const Color(0xFFFFEBEE),
                  ),
                ]
              )
            )
          ]
        )
      )
    );
  }
}
