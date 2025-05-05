# Integração LiteNet2 - Sistema de Controle de Acesso

Este é um MVP (Minimum Viable Product) de integração com as catracas LiteNet2 da [Actuar](https://www.actuar.com/software) usando Electron e Node.js. O projeto implementa uma interface desktop para controle de acesso independente, utilizando o protocolo TCP/IP para comunicação com o equipamento.

## 🚀 Características

- Interface desktop moderna e intuitiva
- Comunicação TCP/IP com a catraca LiteNet2
- Cadastro e gerenciamento de usuários
- Controle de biometria
- Liberação de acesso
- Log de eventos em tempo real
- Persistência local de dados
- Status de conexão em tempo real

## 🛠️ Tecnologias

- [Electron](https://www.electronjs.org/) - Framework para desenvolvimento desktop
- [Node.js](https://nodejs.org/) - Runtime JavaScript
- TCP/IP - Protocolo de comunicação
- HTML/CSS/JavaScript - Interface do usuário

## ⚙️ Pré-requisitos

- Node.js 14.x ou superior
- npm (Node Package Manager)
- Catraca LiteNet2 configurada na rede

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/fmomoreira/integracao-litnet2-actuar.git
```

2. Entre no diretório:
```bash
cd integracao-litnet2-actuar
```

3. Instale as dependências:
```bash
npm install
```

4. Inicie o aplicativo:
```bash
npm start
```

## 🔧 Configuração

1. Ao iniciar o aplicativo, configure o IP e a porta da catraca LiteNet2
2. Clique em "Conectar" para estabelecer a comunicação
3. O indicador ficará verde quando a conexão for estabelecida
4. Pronto para usar!

## 💻 Uso

1. **Cadastro de Usuário**
   - Preencha nome e matrícula
   - Clique em "Cadastrar Aluno"

2. **Cadastro de Biometria**
   - Selecione um usuário
   - Clique em "Cadastrar Biometria"
   - Siga as instruções no display da catraca

3. **Liberação de Acesso**
   - Selecione um usuário
   - Clique em "Liberar Acesso"

## 🔍 Estrutura do Projeto

- `main_tcp.js` - Lógica de comunicação TCP/IP
- `index.html` - Interface do usuário
- `package.json` - Configurações e dependências

## 📡 Protocolo de Comunicação

O projeto utiliza o protocolo TCP/IP para comunicação com a catraca LiteNet2, seguindo a documentação oficial disponível em [Toletus/litenet2-manuaisdeintegracao](https://github.com/Toletus/litenet2-manuaisdeintegracao).

Estrutura do pacote:
- 2 bytes: Comando (little-endian)
- 16 bytes: Dados (ASCII)
- 2 bytes: Preenchimento (zeros)

## 🤝 Contribuição

Este é um projeto MVP em desenvolvimento. Contribuições são bem-vindas! 

## ✨ Créditos

- **Desenvolvedor**: Felipe Moreira
- **Parceiro**: Windsurf

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

⌨️ com ❤️ por [Felipe Moreira](https://github.com/fmomoreira)
