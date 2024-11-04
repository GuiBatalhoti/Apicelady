//Classe da Tag, com seus parâmetros e o método de print
class Tag {
  public:
    String RSSI;
    String PC;
    String EPC;
    String CRC;

    Tag(String RSSI, String PC, String EPC, String CRC){
      this->RSSI = RSSI;
      this->PC = PC;
      this->EPC = EPC;
      this->CRC = CRC;
    }

    Tag(){

    }

    ~Tag(){
      
    }

    // Método para imprimir os valores da classe
    void toString() {
      Serial.print("%") //indicador de início de impressão de Tag
      Serial.print("RSSI:");
      Serial.print(RSSI);
      Serial.print(";PC:");
      Serial.print(PC);  
      Serial.print(";EPC:");
      Serial.print(EPC); 
      Serial.print(";CRC:");
      Serial.print(CRC);
      Serial.println("$") //indicador de fim de impressão de Tag
    }
};


// Variáveis globais

// não utilizar, apenas diminuir o tempo para a leitura do "ComandoReadOnce"
// unsigned char CommandReadMultiFFFF[10] = {0XAA,0X00,0X27,0X00,0X03,0X22,0XFF,0XFF,0X4A,0XDD}; //ler 0xFFFF vezes 
// unsigned char CommandReadMulti20[10] = {0XAA,0X00,0X27,0X00,0X03,0X22,0X00,0X01,0X4D,0XDD}; //ler 0x20 == 32 vezes
unsigned char CommandReadOnce[7] = {0XAA, 0X00, 0X22, 0X00, 0X00, 0X22, 0XDD}; // le apenas uma única vez
unsigned int comando = 2;


//inicialmente nada é recebido, nem contado
unsigned int dadosRecebidos = 0;
bool recebendoDados = false;
unsigned int loopCount = 0;

//Tag anterior
Tag tagAnterior("","","","");


//caso seja necessário fazer alguma coisa antes da leitura
unsigned int lerSerial() {
  return Serial.read();
}


// leitura dos dados da Tag
Tag lerDados(Tag tag) {
  unsigned int aux1 = lerSerial(); //PL(MSB)
  unsigned int aux2 = lerSerial(); //PL(LSB)
  unsigned int tamanhoParam = (aux1 << 8) | aux2; //tamanho do frame um bytes
  aux1 = lerSerial();
  tag.RSSI = String(aux1, DEC);
  aux1 = lerSerial(); //PC(MSB)
  aux2 = lerSerial(); //PC(LSB)
  aux1 = (aux1 << 8) | aux2;
  tag.PC = String(aux1, DEC);

  aux1 = lerSerial();
  for (unsigned int i = 0x04; i <= tamanhoParam; i++) { //i inicia em 4, pois já foram lidos 4 campos do frame dentro do tamanho do parâmetro
    if (i == tamanhoParam - 0x02) { //os dois últimos campos do frame
      tag.EPC = String(aux1, DEC);
      aux1 = lerSerial(); //CRC(MSB)
      aux2 = lerSerial(); //CRC(LSB)
      aux1 = (aux1 << 8) | aux2;
      tag.CRC = String(aux1, DEC);
      break;
    }
    aux2 = lerSerial();
    aux1 = (aux1 << 8) | aux2; //desloca os bits mais significativos do número
  }
  aux1 = lerSerial(); //Checksum
  aux2 = lerSerial(); //EOF

  return tag;
}


// Comando que o arduino envia para a placa
void comandoLeitura() {
  if (loopCount >= 25) { //garantia que o arduino vai ler pelo menos um quadro completo, antes de reenviar o comando
    //apenas para indicar que o comando vai ser enviado
    digitalWrite(LED_BUILTIN, HIGH);
    switch (comando) {
      // Comentado por desuso
      // case 0:
      //   Serial.write(CommandReadMultiFFFF,10);
      //   break;
      // case 1:
      //   Serial.write(CommandReadMulti20,10);
      //   break;
      case 2:
        Serial.write(CommandReadOnce,7);
        break;
    }
    digitalWrite(LED_BUILTIN, LOW);
    loopCount = 0; //reset do contado de leituras
  }
}


void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);
  delay(2000);
}


void loop() {

  comandoLeitura();

  if (Serial.available() > 0) { //porta serial do USB
    /* Exemplo de frame de resposta do leitor:
     * AA --> cabeçalho
     * 02 --> tipo de frame (0x00 enviado para o leitor; 0x01 resposta do leitor; 0x02 notificação do leitor)
     * 22 --> comando/instrução
     * 00 --> PL(MSB) (tamanho do parâmetro) o tamaho do parâmetro vai do RSSI é o CRC(LSB)
     * 11 --> PL(LSB) (tamanho do parâmetro)
     * C9 --> RSSI 
     * 34 --> PC(MSB)
     * 00 --> PC(LSB)
     * 30 ... 70 --> EPC
     * 3A --> CRC(MSB)
     * 76 --> CRC(LSB)
     * EF --> Checksum (não entra no tamanho do parâmetro)
     * DD --> End
    */

    Tag tag;
    dadosRecebidos = lerSerial(); //lê o Header ou o comando, se ler o header, começa a receber os dados, o tipo de quadro é ignorado
    if (dadosRecebidos == 0xAA) { //início do Header
      recebendoDados = true;
    }
    if (dadosRecebidos == 0x22 && recebendoDados) { //comando do quadro, dados da Tag
      tag = lerDados(tag);
      if(!tagAnterior.EPC.equals(tag.EPC)) {
        tag.toString();
        tagAnterior = tag;
      }
      recebendoDados = false; //todos os dados lidos
    }
  }
  //um input a cada 0,5 segundos nessa combinação de loopCount >= 25
  loopCount++;
  delay(20);
}
