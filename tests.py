import unittest

from forms import HeroForm


class TestHeroForm(unittest.TestCase):

    def test_name_required(self):
        f1 = HeroForm()
        f2 = HeroForm(name='')
        self.assertFalse(f1.validate())
        self.assertFalse(f2.validate())

    def test_alias_required(self):
        f1 = HeroForm()
        f2 = HeroForm(alias='')
        self.assertFalse(f1.validate())
        self.assertFalse(f2.validate())


if __name__ == '__main__':
    unittest.main(verbosity=2)
