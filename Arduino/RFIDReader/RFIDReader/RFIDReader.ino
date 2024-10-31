// Variáveis globais
unsigned char CommandReadMultiFFFF[10] = {0XAA,0X00,0X27,0X00,0X03,0X22,0XFF,0XFF,0X4A,0XDD}; //ler 0xFFFF vezes 
unsigned char CommandReadMulti20[10] = {0XAA,0X00,0X27,0X00,0X03,0X22,0X00,0X01,0X4D,0XDD}; //ler 0x20 == 32 vezes
unsigned char CommandReadOnce[7] = {0XAA, 0X00, 0X22, 0X00, 0X00, 0X22, 0XDD}; // le apenas uma única vez
unsigned int comando = 2;
unsigned int dadosRecebidos = 0;
bool recebendoDados = false;
unsigned int loopCount = 0;

class Tag {
  public:
    String RSSI;
    String PC;
    String EPC;
    String CRC;

    // Método para imprimir os valores da classe
    void toString() {
      Serial.print("RSSI: ");
      Serial.print(RSSI);
      Serial.print("PC: ");
      Serial.print(PC);
      Serial.print("EPC: ");
      Serial.print(EPC);
      Serial.print("CRC: ");
      Serial.print(CRC);
    }
};

unsigned int lerSerial() {
  return Serial.read();
}


// Funções
Tag lerDados(Tag tag) {
  unsigned int aux1 = lerSerial(); //PL(MSB)
  unsigned int aux2 = lerSerial(); //PL(LSB)
  unsigned int tamanhoParam = (aux1 << 8) | aux2; //tamanho do frame um bytes
  aux1 = lerSerial();
  tag.RSSI = String(aux1, HEX);
  aux1 = lerSerial(); //PC(MSB)
  aux2 = lerSerial(); //PC(LSB)
  aux1 = (aux1 << 8) | aux2;
  tag.PC = String(aux1, HEX);

  aux1 = lerSerial();
  for (unsigned int i = 0x04; i <= tamanhoParam; i++) { //i inicia em 4, pois já foram lidos 4 campos do frame dentro do tamanho do parâmetro
    aux2 = lerSerial();
    aux1 = (aux1 << 8) | aux2;
    if (i == tamanhoParam - 0x02) { //os dois últimos campos do frame
      tag.EPC = String(aux1, HEX);
      aux1 = lerSerial(); //CRC(MSB)
      aux2 = lerSerial(); //CRC(LSB)
      aux1 = (aux1 << 8) | aux2;
      tag.CRC = String(aux1, HEX);
    }
  }
  aux1 = lerSerial(); //Checksum
  aux2 = lerSerial(); //EOF

  return tag;
}

void comandoLeitura() {
  // Envia o comando para a placa
  if (loopCount >= 30) { //garantia que o arduino vai ler todos os dados recebidos pela placa, fazendo o loop completamente por 30 vezes
    digitalWrite(LED_BUILTIN, HIGH);
    switch (comando) {
      case 0:
        Serial.write(CommandReadMultiFFFF,10);
        break;
      case 1:
        Serial.write(CommandReadMulti20,10);
        break;
      case 2:
        Serial.write(CommandReadOnce,7);
        break;
    }
    digitalWrite(LED_BUILTIN, LOW);
    loopCount = 0;
  }
}


void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);
  delay(2000);
}

void loop() {

  comandoLeitura();

  if (Serial.available() > 0) { //input na porta serial
    /* Exemplo de frame de resposta do leitor:
     * AA --> cabeçalho
     * 02 --> tipo de frame (0x00 enviado para o leitor; 0x01 resposta do leitor; 0x02 notificação do leitor)
     * 22 --> comando/instrução
     * 00 --> PL(MSB) (tamanho do parâmetro)
     * 11 --> PL(LSB) (tamanho do parâmetro)
     * C9 --> RSSI 
     * 34 --> PC(MSB)
     * 00 --> PC(LSB)
     * 30 ... 70 --> EPC
     * 3A --> CRC(MSB)
     * 76 --> CRC(LSB)
     * EF --> Checksum
     * DD --> End
    */

    Tag tag;
    dadosRecebidos = lerSerial(); //lê o Header
    Serial.println(dadosRecebidos, HEX);
    if (dadosRecebidos == 0xAA) { //código do tipo de frame (notificação)
      recebendoDados = true;
    }
    Serial.println(dadosRecebidos, HEX);
    if (dadosRecebidos == 0x22 && recebendoDados) {
      lerDados(tag);
      tag.toString();
      recebendoDados = false;
    }
  }
  loopCount++;
  delay(50);
}
