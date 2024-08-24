# Descrição do Banco de Dados do Projeto ```Apicelady```

Uma empresa é composta por diferentes prédios e departamentos. Um prédio possui várias salas nas quais são alocados patrimônios/bens que precisam ser conferidos. Um Departamento tem funcionários com diferentes cargos e respectivas funções. É responsabilidade do departamento controlar e conferir os patrimônios. Então, o departamento realiza conferências de patrimônios para verificar as condições do patrimônio (vide atributos).

## Atributos básicos
- Empresas: nome, localização[cep, cidadde, rua, número] e descrição.
- Prédios: nome, descrição e localização[cep, cidadde, rua, número].
- Salas: nome, número, descrição, histórico de repsonsáveis.
- Departamento: nome, descrição.
- Funcionário: nome, email, cargo, função.
- Patrimônio: número, descrição, data de aquisição, valor de aquisição, valor presente, status[ativos, baixado, saída [manuntenção, empréstimo]], condição de uso, histórico de localização, histórico de responsáveis.
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
