// =====================
// Core contracts
// =====================

interface Channel {
  send(userId: string, message: string): void;
}

interface MessagePolicy {
  apply(message: string): string;
}

interface DeliveryPolicy {
  beforeSend?(userId: string, message: string): void;
  afterSend?(userId: string, message: string): void;
}

// =====================
// Channels
// =====================

export class EmailChannel implements Channel {
  send(userId: string, message: string): void {
    console.log(`Email to ${userId}: ${message}`);
  }
}

export class SmsChannel implements Channel {
  send(userId: string, message: string): void {
    console.log(`SMS to ${userId}: ${message}`);
  }
}

export class PushChannel implements Channel {
  send(userId: string, message: string): void {
    console.log(`Push to ${userId}: ${message}`);
  }
}

// =====================
// Message policies
// =====================

export class NormalPolicy implements MessagePolicy {
  apply(message: string): string {
    return message;
  }
}

export class UrgentPolicy implements MessagePolicy {
  apply(message: string): string {
    return `🚨 ${message.toUpperCase()}`;
  }
}

export class VipPolicy implements MessagePolicy {
  apply(message: string): string {
    return `⭐ VIP: ${message}`;
  }
}

export class EncryptPolicy implements MessagePolicy {
  apply(message: string): string {
    return btoa(message); // toy encryption
  }
}

// =====================
// Delivery policies
// =====================

export class QuietHoursPolicy implements DeliveryPolicy {
  beforeSend(userId: string, message: string): void {
    const hour = new Date().getHours();
    if (hour < 9 || hour > 21) {
      throw new Error("Blocked by quiet hours");
    }
  }
}

export class LoggingPolicy implements DeliveryPolicy {
  afterSend(userId: string, message: string): void {
    console.log(`LOG: message sent to ${userId}`);
  }
}

// =====================
// Orchestrator
// =====================

export class Notifier {
  private messageProcessor: MessageProcessor;
  private beforeSendService: BeforeSendService;
  private afterSendService: AfterSendService;
  private channelService: ChannelService;
  constructor(
    private userId: string,
    private channel: Channel,
    private messagePolicies: MessagePolicy[],
    private deliveryPolicies: DeliveryPolicy[] = []
  ) {
    this.messageProcessor = new MessageProcessor(messagePolicies)
    this.beforeSendService = new BeforeSendService(userId, deliveryPolicies)
    this.channelService = new ChannelService(userId, channel)
    this.afterSendService = new AfterSendService(userId, deliveryPolicies)
  }

  send(message: string): void {
    const processedMsg = this.messageProcessor.format(message)
    this.beforeSendService.process(processedMsg);
    this.channelService.send(processedMsg);
    this.afterSendService.process(processedMsg);
  }
}

class MessageProcessor {
  constructor(private policies: MessagePolicy[]) { }
  format(msg: string) {
    let resultMsg = msg
    this.policies.forEach(policyInstance => {
      resultMsg = policyInstance.apply(resultMsg)
    })
    return resultMsg
  }
}

class BeforeSendService {
  constructor(private userId: string, private policies: DeliveryPolicy[]) { }
  process(msg: string) {
    for (const policy of this.policies) {
      policy.beforeSend?.(this.userId, msg);
    }
  }
}

class ChannelService {
  constructor(private userId: string, private channel: Channel) { }
  send(msg: string) {
    this.channel.send(this.userId, msg);
  }
}

class AfterSendService {
  constructor(private userId: string, private policies: DeliveryPolicy[]) { }
  process(msg: string) {
    for (const policy of this.policies) {
      policy.afterSend?.(this.userId, msg);
    }
  }
}