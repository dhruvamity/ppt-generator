"""Exercise the formatter's pure sanitizer without external credentials/services."""
import ast
from pathlib import Path
import re
import unittest


module = ast.parse((Path(__file__).parents[1] / 'backend/main.py').read_text())
function = next(node for node in module.body if isinstance(node, ast.FunctionDef) and node.name == 'sanitize_math')
namespace = {'re': re}
exec(compile(ast.Module(body=[function], type_ignores=[]), 'sanitize_math', 'exec'), namespace)
sanitize_math = namespace['sanitize_math']


class MathPreservationTests(unittest.TestCase):
    def test_valid_source_math_is_unchanged(self):
        expressions = [
            r'$\sqrt{x-1}$', r'$x_1 + x_2$',
            r'$\begin{bmatrix}1&2\\0&1\end{bmatrix}$',
            r'$f(x)=\frac{\sqrt{x-1}}{x-3}$',
            r'$x\in\mathbb{R}$ and $\theta^{\circ}$',
            'circular words and circ stay as written',
        ]
        for expression in expressions:
            with self.subTest(expression=expression):
                self.assertEqual(sanitize_math(expression), expression)

    def test_transport_damage_and_extra_delimiter_are_repaired(self):
        self.assertEqual(sanitize_math('$f(x)=\x0crac{1}{x}$'), r'$f(x)=\frac{1}{x}$')
        self.assertEqual(sanitize_math(r'$\sqrt{2}$ units$'), r'$\sqrt{2}$ units')
        self.assertEqual(sanitize_math(r'\(x_1\)'), r'$x_1$')


if __name__ == '__main__':
    unittest.main()
