import { Avatar, Box, Stack, Typography } from '@mui/material';

type ChatBubbleVariant = 'sent' | 'received';

export interface ChatBubbleProps {
  variant: ChatBubbleVariant;
  content: string;
  author: string;
  avatar?: string | null;
  timestamp: string;
}

export function ChatBubble({ variant, content, author, avatar, timestamp }: ChatBubbleProps) {
  const isSent = variant === 'sent';

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        justifyContent: isSent ? 'flex-end' : 'flex-start',
        alignItems: 'flex-end',
      }}
    >
      {!isSent && (
        <Avatar
          src={avatar ?? undefined}
          alt={author}
          sx={{ width: 32, height: 32, fontSize: '0.875rem' }}
        >
          {author[0]?.toUpperCase()}
        </Avatar>
      )}

      <Stack spacing={0.25} sx={{ maxWidth: '75%', alignItems: isSent ? 'flex-end' : 'flex-start' }}>
        {!isSent && (
          <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
            {author}
          </Typography>
        )}

        <Box
          sx={{
            px: 1.5,
            py: 1,
            borderRadius: 2.5,
            bgcolor: isSent ? 'primary.main' : 'grey.100',
            color: isSent ? 'primary.contrastText' : 'text.primary',
            borderBottomRightRadius: isSent ? 4 : undefined,
            borderBottomLeftRadius: !isSent ? 4 : undefined,
            wordBreak: 'break-word',
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {content}
          </Typography>
        </Box>

        <Typography variant="caption" color="text.disabled" sx={{ px: 0.5 }}>
          {timestamp}
        </Typography>
      </Stack>

      {isSent && (
        <Avatar
          src={avatar ?? undefined}
          alt={author}
          sx={{ width: 32, height: 32, fontSize: '0.875rem' }}
        >
          {author[0]?.toUpperCase()}
        </Avatar>
      )}
    </Stack>
  );
}
