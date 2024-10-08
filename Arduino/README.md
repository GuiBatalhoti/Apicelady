# Código do Arduino

Todos os códigos desenvolvidos para o Arduino e placa RFID estão nesse diretório. 

Todas as especificações estão seguindo o Manual do Fabricante do R200 UHF RFID Reader da Shenzhen YanPoDo Technology Co. Ltd.

## Definindo as configurações da Placa RFID

1. O bitrate de comunicação da placa RFID é de 115200 bps. Portanto, a comunicação serial entre o Arduino e o módulo RFID deve ser configurada para esta taxa de transmissão.

Além disso, existe a necessidade de enviar comandos ao Firmware da placa, que também estão no Manual do Fabricante. Para isso, é necessário enviar os comandos em formato hexadecimal.

