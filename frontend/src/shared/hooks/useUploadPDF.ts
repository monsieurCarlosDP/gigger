import { useMutation } from '@tanstack/react-query';
import { api } from '@/shared/api/client';

interface UploadPDFParams {
  filename: string;
  content: string; // base64
}

export function useUploadPDF() {
  return useMutation({
    mutationFn: async (data: UploadPDFParams) => {
      const res = await api.uploadPDF({
        filename: data.filename,
        content: data.content,
      });
      return res.data;
    },
  });
}
