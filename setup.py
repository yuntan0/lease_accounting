from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in lease_accounting/__init__.py
from lease_accounting import __version__ as version

setup(
	name="lease_accounting",
	version=version,
	description="Lease Accounting Module",
	author="John Park",
	author_email="yuntan0@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
