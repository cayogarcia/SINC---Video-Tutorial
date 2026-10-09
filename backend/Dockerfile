FROM python:3.11

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o requirements.txt primeiro para aproveitar cache do Docker em builds futuros
COPY requirements.txt .

# Instala as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o conteúdo da pasta backend (incluindo a pasta app/)
COPY . .

# Comando para rodar o servidor FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
