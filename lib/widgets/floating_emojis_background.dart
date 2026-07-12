import 'dart:math';
import 'package:flutter/material.dart';

/// Camada de fundo com emojis flutuando suavemente, em loop infinito.
///
/// Pensado para ficar atrás do conteúdo principal (use dentro de um
/// [Stack]). Cada emoji é animado de forma independente e isolado com
/// [RepaintBoundary], então o repaint de um emoji não força redesenho
/// da árvore inteira — mantém o custo baixo mesmo em aparelhos mais
/// fracos.
class FloatingEmojisBackground extends StatefulWidget {
  final List<String> emojis;
  final int count;
  final double minSize;
  final double maxSize;
  final double opacity;

  const FloatingEmojisBackground({
    super.key,
    this.emojis = const ['💚','🧸'],
    this.count = 10,
    this.minSize = 18,
    this.maxSize = 34,
    this.opacity = 0.35,
  });

  @override
  State<FloatingEmojisBackground> createState() =>
      _FloatingEmojisBackgroundState();
}

class _FloatingEmojisBackgroundState extends State<FloatingEmojisBackground>
    with TickerProviderStateMixin {
  late final List<_EmojiParticle> _particles;
  final Random _random = Random();

  @override
  void initState() {
    super.initState();
    _particles = List.generate(widget.count, (index) => _createParticle());
  }

  _EmojiParticle _createParticle() {
    // Duração e atraso variados evitam que todos os emojis subam
    // "em sincronia", o que pareceria artificial.
    final duration = Duration(milliseconds: 8000 + _random.nextInt(6000));
    final controller = AnimationController(vsync: this, duration: duration)
      ..repeat();

    return _EmojiParticle(
      emoji: widget.emojis[_random.nextInt(widget.emojis.length)],
      controller: controller,
      startX: _random.nextDouble(),
      size: widget.minSize +
          _random.nextDouble() * (widget.maxSize - widget.minSize),
      swayAmount: 12 + _random.nextDouble() * 18,
      // Fase inicial diferente para cada emoji, mesmo com o mesmo
      // controller duration — reforça o efeito não sincronizado.
      phaseOffset: _random.nextDouble() * 2 * pi,
      delay: _random.nextDouble(),
    );
  }

  @override
  void dispose() {
    for (final particle in _particles) {
      particle.controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return Stack(
          children: _particles.map((particle) {
            // IMPORTANTE: Positioned precisa ser filho DIRETO do Stack.
            // O RepaintBoundary entra por dentro do Positioned (envolvendo
            // só o conteúdo visual), nunca por fora — senão o Stack não
            // reconhece o Positioned e lança "Incorrect use of
            // ParentDataWidget".
            return AnimatedBuilder(
              animation: particle.controller,
              builder: (context, child) {
                // t vai de 0.0 a 1.0 e reinicia (sobe e "renasce" embaixo)
                final t = (particle.controller.value + particle.delay) % 1.0;

                final height = constraints.maxHeight;
                final width = constraints.maxWidth;

                // Sobe de baixo (1.2x altura) até acima da tela (-0.2x)
                final y = height * (1.2 - 1.4 * t);

                // Balanço lateral suave em torno da posição X inicial
                final sway = sin((t * 2 * pi) + particle.phaseOffset) *
                    particle.swayAmount;
                final x = (particle.startX * width) + sway;

                // Fade in/out nas pontas do percurso
                final fade = (t < 0.1)
                    ? t / 0.1
                    : (t > 0.85)
                        ? (1.0 - t) / 0.15
                        : 1.0;

                return Positioned(
                  left: x,
                  top: y,
                  child: RepaintBoundary(
                    child: Opacity(
                      opacity: (widget.opacity * fade).clamp(0.0, 1.0),
                      child: Text(
                        particle.emoji,
                        style: TextStyle(fontSize: particle.size),
                      ),
                    ),
                  ),
                );
              },
            );
          }).toList(),
        );
      },
    );
  }
}

class _EmojiParticle {
  final String emoji;
  final AnimationController controller;
  final double startX; // 0.0 a 1.0, posição relativa horizontal
  final double size;
  final double swayAmount;
  final double phaseOffset;
  final double delay;

  _EmojiParticle({
    required this.emoji,
    required this.controller,
    required this.startX,
    required this.size,
    required this.swayAmount,
    required this.phaseOffset,
    required this.delay,
  });
}