# Código do Arduino

Todos os códigos desenvolvidos para o Arduino e placa RFID estão nesse diretório. 

Todas as especificações estão seguindo o Manual do Fabricante do R200 UHF RFID Reader da Shenzhen YanPoDo Technology Co. Ltd.

## Funcionamento

1. **Conexão com o Arduino**: O módulo RFID é conectado ao Arduino através dos pinos Tx e Rx. O pino Tx do módulo é conectado ao pino Rx do Arduino e o pino Rx do módulo é conectado ao pino Tx do Arduino.

2. **Leitura de Tags**: O módulo RFID é capaz de ler tags RFID passivas. Para isso, é necessário enviar um comando para o módulo e ele retornará a tag lida.

    2.1. **Comando de Leitura**: O comando de leitura é enviado através da porta serial do Arduino. O comando é enviado em formato de hexadecimal.

    2.2. **Resposta do Módulo**: A cada loop chamada a função "Serial.read()" o arduino lê um byte da porta serial, logo é necessário fazer um loop da leitura. A resposta do módulo é enviada em formato de hexadecimal.

    2.3. **Os Comandos**: Todos os comandos estão explicados no Manual do Fabricante. Os significantes para a leitura foram implementados no código do Arduino. 

3. **Envio de Dados**: A cada um determinado tempo o Arduino envia o camndo de leitura para o módulo RFID e recebe a tag lida.

4. **Comunicação com o Android**: O Arduino envia a tag lida para o Android através da porta serial. O Android recebe a tag e envia para o servidor.