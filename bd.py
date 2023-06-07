import sqlite3

conn = sqlite3.connect('banco_usuarios.db')
cursor = conn.cursor()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS usuarios (
        "usuario" TEXT,
        "nome" TEXT,
        "senha" TEXT,
        "permissoes" TEXT
    )
''')

conn.close()
