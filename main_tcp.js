const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const net = require('net');

let mainWindow;
let client;

// Configuração da conexão TCP/IP com o LiteNet2
const initTcpConnection = (ip = '192.168.1.100', port = 3000) => {
    if (client) {
        client.destroy();
    }

    client = new net.Socket();

    client.connect(port, ip, () => {
        console.log('Conectado ao dispositivo LiteNet2');
        mainWindow.webContents.send('connection-status', true);
    });

    client.on('error', (err) => {
        console.error('Erro na conexão TCP:', err);
    });

    // Buffer para acumular dados recebidos
    let dataBuffer = Buffer.alloc(0);

    client.on('data', (data) => {
        // Acumula dados recebidos
        dataBuffer = Buffer.concat([dataBuffer, data]);

        // Processa pacotes completos (20 bytes cada)
        while (dataBuffer.length >= 20) {
            const packet = dataBuffer.slice(0, 20);
            dataBuffer = dataBuffer.slice(20);

            // Extrai comando (2 primeiros bytes em little-endian)
            const command = packet.readUInt16LE(0);
            // Extrai dados (18 bytes restantes)
            const payload = packet.slice(2).toString('ascii').replace(/\0+$/, '');

            console.log('Pacote recebido:', {
                command: '0x' + command.toString(16).padStart(4, '0'),
                payload,
                raw: packet.toString('hex')
            });

            // Processa diferentes tipos de notificações
            processNotification(command, payload);
        }
    });

    client.on('close', () => {
        console.log('Conexão fechada');
        mainWindow.webContents.send('connection-status', false);
    });
};

// Função para processar notificações recebidas
function processNotification(command, payload) {
    switch (command) {
        case 0x0306: // Notificação de biometria
            const userId = parseInt(payload);
            mainWindow.webContents.send('biometria-detectada', userId);
            break;
        case 0x0304: // Notificação de passagem
            const direction = payload.charCodeAt(0);
            mainWindow.webContents.send('passagem-detectada', {
                direction: direction === 1 ? 'entrada' : 'saída'
            });
            break;
        // Adicione outros casos conforme necessário
    }
}

// Função para enviar comando para o LiteNet2
function sendCommand(commandId, data = '') {
    // Criar buffer de exatamente 20 bytes, inicializado com zeros
    const packet = Buffer.alloc(20, 0);

    // Escrever o comando em little-endian (2 bytes)
    packet.writeUInt16LE(commandId, 0);

    // Tratamento da mensagem:
    // - Se não houver dados, mantém os zeros
    // - Se houver dados, limita a 16 caracteres e converte para ASCII
    if (data) {
        // Limita a mensagem a 16 caracteres
        const limitedData = data.toString().slice(0, 16);
        // Converte para ASCII e preenche com zeros até 16 caracteres
        const ascii = Buffer.from(limitedData.padEnd(16, '\0'), 'ascii');
        // Copia os 16 bytes após os 2 bytes do comando
        ascii.copy(packet, 2, 0, 16);
    }

    console.log('Enviando pacote:', {
        command: '0x' + commandId.toString(16).padStart(4, '0'),
        payload: data,
        raw: packet.toString('hex')
    });

    // Enviar via TCP
    if (client && client.writable) {
        client.write(packet, (err) => {
            if (err) {
                console.error('Erro ao enviar comando:', err);
            }
        });
    } else {
        console.error('Cliente TCP não está conectado');
    }
}

// Função específica para liberar entrada
function liberarEntrada(mensagem = '') {
    // Comando 0x0001 para liberar entrada
    sendCommand(0x0001, mensagem);
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();
    initTcpConnection();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC handlers
ipcMain.on('conectar-dispositivo', (event, { ip, porta }) => {
    console.log('Tentando conectar ao dispositivo:', ip, porta);
    initTcpConnection(ip, parseInt(porta));
});

ipcMain.on('cadastrar-biometria', (event, userId) => {
    sendCommand(0x0106, userId.toString());
});

ipcMain.on('liberar-acesso', (event, { userId, mensagem = '' }) => {
    liberarEntrada(mensagem || `Bem-vindo ${userId}`);
});
