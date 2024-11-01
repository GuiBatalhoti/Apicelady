# Código do Arduino

Todos os códigos desenvolvidos para o Arduino e placa RFID estão nesse diretório. 

Todas as especificações estão seguindo o Manual do Fabricante do R200 UHF RFID Reader da Shenzhen YanPoDo Technology Co. Ltd.

## Funcionamento

1. **Conexão com o Arduino**: O módulo RFID é conectado ao Arduino através dos pinos Tx e Rx. O pino Tx do módulo é conectado ao pino Rx do Arduino e o pino Rx do módulo é conectado ao pino Tx do Arduino. Também a placa precisa de um Ground e 5V para funcionar.

2. **Leitura de Tags**: O módulo RFID é capaz de ler tags RFID passivas. Para isso, é necessário enviar um comando para o módulo e ele retornará a tag lida.

    2.1. **Comando de Leitura**: O comando de leitura é enviado através dos pinos Tx e Rx do Arduino.

    2.2. **Resposta do Módulo**: O módulo envia o quadro de resposta em partes, cada "Serial.read()" lê um byte do quadro, especificado no manual do fabricante.

    2.3. **Os Comandos**: Todos os comandos estão explicados no Manual do Fabricante. Utiliza-se apenas o comando de Leitura única no código.

4. **Comunicação com o Android**: O Arduino envia a tag lida para o Android através da porta USB. O Android recebe os dados enviados pelo Arduino. Para mais infromações, acesse o diretório [/Android](/android).