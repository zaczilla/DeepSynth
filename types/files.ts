export interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  url: string;
  status: 'success' | 'failed' | 'pending';
}