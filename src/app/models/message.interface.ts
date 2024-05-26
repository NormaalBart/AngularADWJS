export interface Message {
    type: MessageType;
    title: string;
    description: string;
  }
  
  export enum MessageType {
    Success = 'success',
    Information = 'information',
    Warning = 'warning'
  }
  