# Requisitos de sistema do Apicelady

## Introdução

Este documento tem o ob jetivo de apresentar os requisitos do sistema Apicelady, detalhando e explicando cada um. O público-alvo do sistema são empresas que desejam automatizar o processo de gerência de  e bens.

## Escopo do sistema

O sistema Apicelady foi desenvolvido visando automatizar o processo de gerência de  e bens. O sistema é capaz de manter registros das aquisições, baixas, movimentos, conferências, localização e detalhes dos  e bens. O sistema também é capaz de gerar relatórios sobre as conferências.

## Definições, acrônimos e abreviações

- **Apicelady**: Sistema de gerência de bens.
- **Bem**: Objeto que possui determinado valor e é de propriedade de uma empresa.
- **Conferência**: Processo de verificação da existência, estado e localização de um bem.
- **Bem Ativo**: Bem que está em posse da empresa, que está sendo utilizado.
- **Bem Baixado**: Bem que não está mais em posse da empresa, que não está sendo utilizado.
- **Bem Manutenção**: Bem que está fora da empresa, com um terceiro, para fins de manutenção.
- **Bem Empréstimo**: Bem cedido pela empresa a um terceiro, para fins de uso temporário.

## Requisitos de sistema

### Requisitos funcionais

- **RF1**: O sistema deve ser capaz de registrar os bens. Cada bem deve possuir número, descrição, data de aquisição, valor de aquisição, valor presente, status (ativos, baixado ou saída [manutenção, empréstimo]), condição de uso (utilizável ou sem condição de uso), localização (e histórico), responsável (e histórico), observações sobre o bem.
    - **RF1.1**: No momento de adição de um novo bem os dados preenchidos deverão ser: número, descrição, data de aquisição, valor de aquisição e valor presente.
        - **RF1.1.1**: Apenas no Departamento de Patrimônio pode adicionar um novo bem.
        - **RF1.1.2**: Todo bem recém adicionado deve iniciar com status `ativo`, condição de uso como `utilizável`, na localização e sob responsabilidae do `Departamento de Patrimônio`.
    - **RF1.2**: O sistema deve permitir apenas a edição dos dados de um bem que esteja com status `ativo`.
    - **RF1.3**: O sistema deve permitir a baixa de um bem, ou seja, alterar o status de `ativo` para `baixado`.
        - **RF1.3.1**: O sistema não deve permitir a edição de nenhum dos dados de bens com status de `baixado`, nem alteração de status para `manutenção` ou `empréstimo`, mas a responsabilidade de localização devem passar para o Departamento de Patrimônio.
    - **RF1.4**: O sistema deve permitir a saída de um bem para manutenção, ou seja, alterar o status de `ativo` para `manutenção` com a data de saída.
        - **RF1.4.1**: No retorno de um bem da manutenção, o sistema deve requisitar a entrada de observações da manutenção, valor do serviço e data de retorno. Quando um bem retornar da manutenção, o status deve ser alterado para `ativo`.
    - **RF1.5**: O sistema deve permitir o empréstimo de um bem, ou seja, alterar o status de `ativo` para `empréstimo` e adicionar a data de saída e nome a quem foi emprestado.
        - **RF1.5.1**: No retorno de um bem emprestado, o sistema deve requisitar a data de retorno e observações sobre o empréstimo. Quando um bem retornar do empréstimo, o status deve ser alterado para `ativo`.
    - **RF1.6**: O sistema deve ser capaz de mostrar os bens filtrados por status: `ativo`, `baixado`, `manutenção` e `empréstimo`.
    - **RF1.7**: O sistema deve permitir a alteração de condição de uso de um bem, de `utilizável` para `sem condição de uso`.
        - **RF1.7.1**: O sistema deve ser capaz de mostrar os bens filtrados por condição de uso: `utilizável` e `sem condição de uso`.
    - **RF1.8**: O sistema deve permitir a movimentação entre salas de um bem, ou seja, alocação ou realocação entre salas de um bem de uma sala para outra, adicionando uma nova localização (sala) e manter no histórico a localização antiga.
        - **RF1.6.1**: O sistema deve ser capaz de mostrar o histórico de localização de um bem.
    - **RF1.9**: O sistema deve permitir a transferência de responsabilidade de um bem de um responsável para outro, ou seja, adicionar um novo responsável e manter no histórico o responsável antigo.
        - **RF1.9.1**: O sistema deve ser capaz de mostrar o histórico de responsáveis de um bem.
    - **RF1.10**: O sistema deve permitir a adição de observações sobre um bem.
        - **RF1.10.1**: O sistema deve ser capaz de mostrar as observações de um bem.
    - **RF1.11**: O Departamento de Patrimônio tem responsabilidade sobre todos os bens, ou seja, todos e qualquer tipo de alteração de um bem deve ser aprovada pelo Departamento de Patrimônio.
- **RF2**: O sistema deve ser capaz de registrar as empresas. Cada empresa deve possuir nome, localização (cep, cidadde, rua, número e pontos gepgráficos [latitude e longitude]) e descrição.
    - **RF2.1**: O sistema deve ser capaz de mostrar todos os dados de uma empresa.
- **RF3**: O sistema deve ser capaz de registrar os prédios. Cada prédio deve possuir nome, descrição e localização (cep, cidadde, rua, número, pontos geográficos [latitude e longitude]) e salas.
    - **RF3.1**: O sistema deve ser capaz de mostrar todos os dados de um prédio.
    - **RF3.2**: O sistema deve ser capaz de mostrar todas as salas de um prédio.
- **RF4**: O sistema deve ser capaz de registrar as salas. Cada sala deve possuir nome, número, descrição, histórico de responsáveis e bens da sala.
- **RF4.1**: O sistema deve ser capaz de mostrar todos os dados de uma sala.
- **RF5**: O sistema deve ser capaz de registrar os departamentos. Cada departamento deve possuir nome, descrição.
- **RF5.1**: O sistema deve ser capaz de mostrar todos os dados de um departamento.
- **RF6**: O sistema deve ser capaz de registrar os funcionários. Cada funcionário deve possuir nome, email, cargo, função.
- **RF6.1**: O sistema deve ser capaz de mostrar todos os dados de um funcionário.
- **RF7**: O sistema deve ser capaz de registrar as conferências. Cada conferência deve possuir data e tipo.
- **RF7.1**: O sistema deve ser capaz de mostrar todos os dados de uma conferência.
- **RF8**: O sistema deve ser capaz de gerar relatórios sobre as conferências. Os relatórios devem conter os dados dos /bens conferidos.
- **RF9**: O sistema deve ser capaz de se comunicar com o banco de dados Firebase.
- **RF1**: O sistema deve ter uma forma de comunicação com o dispositivo o Arduino para leitura dos 