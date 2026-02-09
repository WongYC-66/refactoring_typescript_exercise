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
  constructor(
    private userId: string,
    private channel: Channel,
    private messagePolicies: MessagePolicy[],
    private deliveryPolicies: DeliveryPolicy[] = []
  ) {}

  send(message: string): void {
    let processed = message;

    for (const policy of this.messagePolicies) {
      processed = policy.apply(processed);
    }

    for (const policy of this.deliveryPolicies) {
      policy.beforeSend?.(this.userId, processed);
    }

    this.channel.send(this.userId, processed);

    for (const policy of this.deliveryPolicies) {
      policy.afterSend?.(this.userId, processed);
    }
  }
}
