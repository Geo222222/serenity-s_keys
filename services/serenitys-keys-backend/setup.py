from setuptools import setup, find_packages

setup(
    name="serenitys-keys-backend",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi==0.115.0",
        "uvicorn[standard]==0.30.5",
        "python-dotenv==1.0.1",
        "pydantic==2.9.2",
        "SQLAlchemy==2.0.36",
        "alembic==1.13.2",
    ],
)