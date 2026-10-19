import unittest
from app import add, multiply


class CalculatorTests(unittest.TestCase):
    def test_add_positive(self):
        self.assertEqual(add(2, 3), 5)

    def test_add_negative(self):
        self.assertEqual(add(-5, 2), -3)

    def test_multiply(self):
        self.assertEqual(multiply(4, 3), 12)
