export interface Post {
  id: number;
  patientId: string;
  patientName: string;
  messageType: string;
  status: 'Processed' | 'Failed' | 'Pending';
  lastUpdated: string;
}

export interface ProcessingEvent {
  label: string;
  timestamp: string;
  status: 'Success' | 'Warning' | 'Error';
}
