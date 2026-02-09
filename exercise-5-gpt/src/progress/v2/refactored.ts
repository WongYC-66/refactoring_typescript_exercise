interface Parameters {
  channel: 'sms' | 'email' | 'push',
  urgent?: boolean
  vip?: boolean
  encrypt?: boolean
  logging?: boolean
  quietHours?: boolean
  currentDate?: Date
}

class MessageProcessor {
  constructor(private params: Parameters) { }
  format(msg: string) {
    if (this.params.encrypt) msg = btoa(msg)
    if (this.params.urgent) msg = `🚨 ${msg.toUpperCase()}`
    if (this.params.vip) msg = `⭐ VIP: ${msg}`
    return msg
  }
}

class BeforeSendService {
  constructor(private userId: string, private params: Parameters) { }
  process(msg: string) {
    if (this.params.quietHours) this.checkIfQuietHour()
  }
  checkIfQuietHour = () => {
    const date = this.params.currentDate ?? new Date()
    const hour = date.getHours();
    if (hour < 9 || hour >= 21) {
      throw new Error("Blocked by quiet hours");
    }
  }
}

class ChannelService {
  private sendMethod: Record<string, Function>
  constructor(private userId: string, private params: Parameters) {
    this.sendMethod = {
      "email": (msg: string) => console.log(`Email to ${this.userId}: ${msg}`),
      "sms": (msg: string) =>  console.log(`SMS to ${this.userId}: ${msg}`),
      "push": (msg: string) => console.log(`Push to ${this.userId}: ${msg}`),
    }
  }
  send(msg: string) {
    let method = this.sendMethod[this.params.channel]
    method(msg)
  }
}

class AfterSendService {
  constructor(private userId: string, private params: Parameters) { }
  process(msg: string) {
    if (this.params.logging) console.log(`LOG: message sent to ${this.userId}`);
  }
}

export class Notifier {
  private messageProcessor: MessageProcessor;
  private beforeSendService: BeforeSendService;
  private afterSendService: AfterSendService;
  private channelService: ChannelService;
  constructor(
    private userId: string,
    private params: Parameters,
  ) {
    this.messageProcessor = new MessageProcessor(params)
    this.beforeSendService = new BeforeSendService(userId, params)
    this.channelService = new ChannelService(userId, params)
    this.afterSendService = new AfterSendService(userId, params)
  }

  send(message: string): void {
    const processedMsg = this.messageProcessor.format(message)
    this.beforeSendService.process(processedMsg);
    this.channelService.send(processedMsg);
    this.afterSendService.process(processedMsg);
  }
}


