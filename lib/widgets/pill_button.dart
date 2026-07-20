import 'package:flutter/material.dart';

class PillButton extends StatelessWidget {
  final String label;
  final TextStyle textStyle;
  final Color backgroundColor;
  final VoidCallback onPressed;
  final IconData? icon;

  const PillButton({
    super.key,
    required this.label,
    required this.textStyle,
    required this.backgroundColor,
    required this.onPressed,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: backgroundColor,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(28),
          ),
        ),
        child: icon == null
            ? Text(label, style: textStyle)
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(icon, color: textStyle.color, size: 20),
                  const SizedBox(width: 8),
                  Text(label, style: textStyle),
                ],
              ),
      ),
    );
  }
}
