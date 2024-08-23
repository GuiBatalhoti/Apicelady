# Descrição do Banco de Dados do Projeto ```Apicelady```

Uma empresa é composta por diferentes prédios e departamentos. Um prédio possui várias salas nas quais são alocados patrimônios/bens que precisam ser conferidos. Um Departamento tem funcionários com diferentes cargos e respectivas funções. É responsabilidade do departamento controlar e conferir os patrimônios. Então, o departamento realiza conferências de patrimônios para verificar a alocação e disponibilidade.

## Atributos básicos
- Empresas: nome, localização[cep, cidadde, rua, número] e descrição.
- Prédios: nome e descrição.
- Salas: nome, número e descrição.
- Departamento: nome, descrição.
- Funcionário: nome, email, cargo, função.
- Patrimônio: número, descrição.
- Conferência: data.

## Relações
- Empresa possui Prédios.
- Empresa possui Departamentos.
- Prédio possui Salas.
- Sala aloca-se Patrimônio.
- Departamento responsável Salas.
- Departamento possui Funcionário.
- Departamento realiza Conferência.
- Da realização da conferência participa Funcionário.
- Conferência confere Patrimônio.
