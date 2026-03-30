import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { execSync } from 'child_process';

type ConnectionStatus = 'disconnected' | 'qr_pending' | 'connected';

let client: Client | null = null;
let status: ConnectionStatus = 'disconnected';

function createClient(): Client {
  const sessionPath = process.env.WHATSAPP_SESSION_PATH || '.whatsapp-session';

  return new Client({
    authStrategy: new LocalAuth({ dataPath: sessionPath }),
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      protocolTimeout: 60000,
    },
  });
}

function killStaleChromeProcesses(): void {
  const sessionPath = process.env.WHATSAPP_SESSION_PATH || '.whatsapp-session';

  try {
    execSync(`pkill -9 -f "${sessionPath}" || true`, { stdio: 'ignore' });
  } catch {
    // Sin procesos que matar
  }

  try {
    execSync(`find ${sessionPath} -name "SingletonLock" -delete 2>/dev/null || true`, { stdio: 'ignore' });
    console.log('[WhatsApp] Sesión Chrome anterior limpiada');
  } catch {
    // Sin lock que eliminar
  }
}

export function initialize(): void {
  if (client) return;

  killStaleChromeProcesses();

  client = createClient();

  client.on('qr', (qr) => {
    status = 'qr_pending';
    console.log('\n[WhatsApp] Escanea el código QR con tu móvil:\n');
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    status = 'connected';
    console.log('[WhatsApp] Cliente conectado y listo');
  });

  client.on('auth_failure', (msg) => {
    status = 'disconnected';
    console.error('[WhatsApp] Error de autenticación:', msg);
    client = null;
  });

  client.on('disconnected', (reason) => {
    status = 'disconnected';
    console.warn('[WhatsApp] Desconectado:', reason);
    client = null;
  });

  client.initialize().catch((err) => {
    console.error('[WhatsApp] Error al inicializar:', err);
    status = 'disconnected';
    client = null;
  });
}

export default {
  async getStatus() {
    let info: { pushname?: string; wid?: string } | null = null;
    if (status === 'connected' && client) {
      try {
        const clientInfo = client.info;
        info = { pushname: clientInfo?.pushname, wid: clientInfo?.wid?._serialized };
      } catch {
        // info no disponible
      }
    }
    return { status, info };
  },

  async getChats() {
    if (status !== 'connected' || !client) {
      throw new Error('WhatsApp no está conectado');
    }

    const chats = await client.getChats();
    return chats.map((chat) => ({
      id: chat.id._serialized,
      name: chat.name,
      isGroup: chat.isGroup,
    })).sort((a, b) => a.name.localeCompare(b.name));
  },

  async getGroups() {
    if (status !== 'connected' || !client) {
      throw new Error('WhatsApp no está conectado');
    }

    const chats = await client.getChats();
    return chats
      .filter((chat) => chat.isGroup)
      .map((chat) => ({
        id: chat.id._serialized,
        name: chat.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  async sendMessage(to: string, content: string) {
    if (status !== 'connected' || !client) {
      throw new Error('WhatsApp no está conectado');
    }

    const msg = await client.sendMessage(to, content);
    return {
      id: msg.id._serialized,
      to,
      content,
      timestamp: msg.timestamp,
    };
  },

  initialize,
};
