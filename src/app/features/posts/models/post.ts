export interface Post {
  id: number;
  patientId: string;
  patientName: string;
  messageType: string;
  status: 'Processed' | 'Failed' | 'Pending';
  lastUpdated: string;
}
