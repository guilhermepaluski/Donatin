import 'package:flutter/material.dart';
import 'package:donatin/theme/app_colors.dart';

class CategoryCard extends StatelessWidget {
  final String categoryTitle;
  final Color categoryBgColor;
  final IconData categoryIcon;
  final Color categoryIconColor;
  final bool categoryIsSelected;
  final VoidCallback? categoryOnTap;

  const CategoryCard({
    super.key,
    required this.categoryTitle,
    required this.categoryBgColor,
    required this.categoryIcon,
    required this.categoryIconColor,
    this.categoryIsSelected = false,
    this.categoryOnTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: categoryOnTap,
      child: Padding(
        padding: const EdgeInsets.only(right: 24.0),
        child: Column(
          children: [
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                color: categoryBgColor,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(categoryIcon, color: categoryIconColor, size: 28),
            ),
            const SizedBox(height: 8),
            Text(
              categoryTitle,
              style: TextStyle(
                fontSize: 12,
                fontWeight: categoryIsSelected
                    ? FontWeight.bold
                    : FontWeight.normal,
                color: AppColors.black,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
