import 'package:flutter/material.dart';

class PillButton extends StatelessWidget {
  final String label;
  final TextStyle textStyle;
  final Color backgroundColor;
  final VoidCallback onPressed;

  const PillButton({
    super.key,
    required this.label,
    required this.textStyle,
    required this.backgroundColor,
    required this.onPressed,
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
        child: Text(label, style: textStyle),
      ),
    );
  }
}
