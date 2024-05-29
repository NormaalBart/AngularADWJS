export interface MessageInterface {
    type: MessageType;
    translateKey: string;
    params?: { [key: string]: string };
  }
  
  export enum MessageType {
    Success = 'success',
    Information = 'information',
    Warning = 'warning'
  }
  