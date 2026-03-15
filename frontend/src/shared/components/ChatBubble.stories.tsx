import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '@mui/material';
import { ChatBubble } from './ChatBubble';

const meta: Meta<typeof ChatBubble> = {
  title: 'Shared/ChatBubble',
  component: ChatBubble,
};

export default meta;
type Story = StoryObj<typeof ChatBubble>;

export const Received: Story = {
  args: {
    variant: 'received',
    content: 'Hola, ¿a qué hora quedamos para montar el equipo?',
    author: 'Carlos',
    timestamp: '10:32',
  },
};

export const Sent: Story = {
  args: {
    variant: 'sent',
    content: 'Sobre las 9:00 estaría bien, así nos da tiempo a probar sonido antes del evento.',
    author: 'Tú',
    timestamp: '10:35',
  },
};

export const ReceivedWithAvatar: Story = {
  args: {
    variant: 'received',
    content: 'Perfecto, llevo los cables extra por si acaso.',
    author: 'María',
    avatar: 'https://i.pravatar.cc/64?u=maria',
    timestamp: '10:40',
  },
};

export const SentWithAvatar: Story = {
  args: {
    variant: 'sent',
    content: 'Genial, nos vemos allí.',
    author: 'Tú',
    avatar: 'https://i.pravatar.cc/64?u=me',
    timestamp: '10:41',
  },
};

export const LongMessage: Story = {
  args: {
    variant: 'received',
    content:
      'He hablado con el responsable del venue y me ha dicho que podemos acceder desde las 7:30 de la mañana. Hay que entrar por la puerta lateral porque la principal estará cerrada hasta las 10:00. Os paso la ubicación exacta por aquí cuando la tenga.',
    author: 'Pedro',
    timestamp: '11:02',
  },
};

export const Conversation: Story = {
  render: () => (
    <Stack spacing={1.5} sx={{ maxWidth: 480, mx: 'auto', p: 2 }}>
      <ChatBubble
        variant="received"
        content="¿Habéis confirmado el catering?"
        author="María"
        avatar="https://i.pravatar.cc/64?u=maria"
        timestamp="09:15"
      />
      <ChatBubble
        variant="sent"
        content="Sí, confirmado para 120 personas."
        author="Tú"
        avatar="https://i.pravatar.cc/64?u=me"
        timestamp="09:18"
      />
      <ChatBubble
        variant="received"
        content="Perfecto. El DJ llega a las 18:00, ¿le paso tu contacto?"
        author="Carlos"
        timestamp="09:22"
      />
      <ChatBubble
        variant="sent"
        content="Dale, sin problema."
        author="Tú"
        avatar="https://i.pravatar.cc/64?u=me"
        timestamp="09:23"
      />
      <ChatBubble
        variant="received"
        content="Una cosa más: el cliente ha pedido cambiar la disposición de las mesas. Os mando el plano actualizado esta tarde."
        author="María"
        avatar="https://i.pravatar.cc/64?u=maria"
        timestamp="09:30"
      />
    </Stack>
  ),
};
