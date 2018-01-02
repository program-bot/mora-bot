export interface IMessage {
  ToUserName: string
  FromUserName: string
  CreateTime: string
  MsgId: string
  MsgType: 'text' | 'image' | 'voice' | 'video' | 'shortvideo' | 'location' | 'link' | 'event' | 'device_text' | 'device_event'
}

export interface ITextMessage extends IMessage {
  Content: string
}

export interface IImageMessage extends IMessage {
  PicUrl: string
  MediaId: string
}
export interface IVoiceMessage extends IMessage {
  Format: string
  MediaId: string
}
export interface IVideoMessage extends IMessage {
  MediaId: string
  ThumbMediaId: string
}
export interface IShortVideoMessage extends IVideoMessage {}

export interface ILocationMessage extends IMessage {
  Location_X: string,
  Location_Y: string,
  Scale: string,
  Label: any,
}
export interface ILinkMessage extends IMessage {
  Title: string,
  Description: string,
  Url: string,
}
export interface IEventMessage extends IMessage {
  // Event: 'LOCATION',
  // Latitude: '23.137466',
  // Longitude: '113.352425',
  // Precision: '119.385040',
}
export interface IDeviceTextMessage extends IMessage {
  // DeviceType: 'gh_d3e07d51b513'
  // DeviceID: 'dev1234abcd',
  // Content: 'd2hvc3lvdXJkYWRkeQ==',
  // SessionID: '9394',
  // OpenID: 'oPKu7jgOibOA-De4u8J2RuNKpZRw'
}
export interface IDeviceEventMessage extends IMessage {
  // Event: 'bind'
  // DeviceType: 'gh_d3e07d51b513'
  // DeviceID: 'dev1234abcd',
  // OpType : 0, //Event为subscribe_status/unsubscribe_status时存在
  // Content: 'd2hvc3lvdXJkYWRkeQ==', //Event不为subscribe_status/unsubscribe_status时存在
  // SessionID: '9394',
  // OpenID: 'oPKu7jgOibOA-De4u8J2RuNKpZRw'
}

export type Message = ITextMessage | IImageMessage | IVoiceMessage | IVideoMessage | IShortVideoMessage | ILocationMessage | ILinkMessage | IEventMessage | IDeviceTextMessage | IDeviceEventMessage
