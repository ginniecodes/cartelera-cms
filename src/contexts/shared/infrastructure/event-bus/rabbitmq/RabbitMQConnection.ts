import amqplib, { ConsumeMessage } from "amqplib";
import { Service } from "diod";

export const retrySuffix = ".retry";
export const deadLetterSuffix = ".dead_letter";
export const exchangeName = "domain_events";
export const retryExchange = `${exchangeName}${retrySuffix}`;
export const deadLetterExchange = `${exchangeName}${deadLetterSuffix}`;

export type Settings = {
	username: string;
	password: string;
	vhost: string;
	connection: {
		hostname: string;
		port: number;
	};
};

@Service()
export class RabbitMQConnection {
	private amqpConnection?: amqplib.Connection;
	private amqpChannel?: amqplib.ConfirmChannel;
	private readonly settings: Settings = {
		username: process.env.RABBITMQ_USERNAME ?? "cartelera",
		password: process.env.RABBITMQ_PASSWORD ?? "cartelera",
		vhost: process.env.RABBITMQ_VHOST ?? "/",
		connection: {
			hostname: process.env.RABBITMQ_HOSTNAME ?? "localhost",
			port: parseInt(process.env.RABBITMQ_PORT ?? "5672", 10)
		}
	};

	async connect(): Promise<void> {
		this.amqpConnection = await this.amqpConnect();
		this.amqpChannel = await this.amqpChannelConnect();
	}

	async close(): Promise<void> {
		await this.channel().close();
		await this.connection().close();
	}

	async publish(
		exchange: string,
		routingKey: string,
		content: Buffer,
		options: amqplib.Options.Publish
	): Promise<void> {
		return new Promise((resolve: Function, reject: Function) => {
			this.channel().publish(exchange, routingKey, content, options, (error: unknown) =>
				error ? reject(error) : resolve()
			);
		});
	}

	async publishToRetry(message: ConsumeMessage, queueName: string): Promise<void> {
		const options = this.generateMessageOptionsFromMessageToRepublish(message);

		await this.publish(retryExchange, queueName, message.content, options);
	}

	async publishToDeadLetter(message: ConsumeMessage, queueName: string): Promise<void> {
		const options = this.generateMessageOptionsFromMessageToRepublish(message);

		await this.publish(deadLetterExchange, queueName, message.content, options);
	}

	async consume(queue: string, subscriber: (message: ConsumeMessage) => {}): Promise<void> {
		await this.channel().consume(queue, (message: ConsumeMessage | null) => {
			if (message) {
				subscriber(message);
			}
		});
	}

	async ack(message: ConsumeMessage): Promise<void> {
		this.channel().ack(message);
	}

	async declareQueue(
		name: string,
		exchangeName: string,
		bindingKeys: string[],
		deadLetterExchange?: string,
		deadLetterQueue?: string,
		messageTTL?: number
	): Promise<void> {
		await this.channel().assertQueue(name, {
			exclusive: false,
			durable: true,
			autoDelete: false,
			arguments: this.generateQueueArguments(deadLetterExchange, deadLetterQueue, messageTTL)
		});

		await Promise.all(
			bindingKeys.map(bindingKey => this.channel().bindQueue(name, exchangeName, bindingKey))
		);
	}

	async declareExchange(name: string): Promise<void> {
		await this.channel().assertExchange(name, "topic", { durable: true });
	}

	private connection(): amqplib.Connection {
		if (!this.amqpConnection) {
			throw new Error("RabbitMQ connection not established");
		}

		return this.amqpConnection;
	}

	private channel(): amqplib.ConfirmChannel {
		if (!this.amqpChannel) {
			throw new Error("RabbitMQ channel not established");
		}

		return this.amqpChannel;
	}

	private async amqpConnect(): Promise<amqplib.Connection> {
		const connection = await amqplib.connect({
			protocol: "amqp",
			hostname: this.settings.connection.hostname,
			port: this.settings.connection.port,
			username: this.settings.username,
			password: this.settings.password,
			vhost: this.settings.vhost
		});

		connection.on("error", (error: unknown) => {
			// TO DO: Add logger
			throw error;
		});

		return connection;
	}

	private async amqpChannelConnect(): Promise<amqplib.ConfirmChannel> {
		const channel = await this.connection().createConfirmChannel();
		await channel.prefetch(1);

		return channel;
	}

	private generateQueueArguments(
		deadLetterExchange?: string,
		deadLetterQueue?: string,
		messageTTL?: number
	) {
		return {
			...(deadLetterExchange && { "x-dead-letter-exchange": deadLetterExchange }),
			...(deadLetterQueue && { "x-dead-letter-routing-key": deadLetterQueue }),
			...(messageTTL !== undefined && { "x-message-ttl": messageTTL })
		};
	}

	private generateMessageOptionsFromMessageToRepublish(message: ConsumeMessage) {
		const { messageId, contentType, contentEncoding, priority } = message.properties;

		return {
			messageId,
			headers: this.incrementRedeliveryCount(message),
			contentType,
			contentEncoding,
			priority
		};
	}

	private incrementRedeliveryCount(message: ConsumeMessage) {
		if (message.properties.headers) {
			if (this.hasBeenRedelivered(message)) {
				const count = parseInt(message.properties.headers["redelivery_count"], 10);
				message.properties.headers["redelivery_count"] = count + 1;
			} else {
				message.properties.headers["redelivery_count"] = 1;
			}
		}

		return message.properties.headers;
	}

	private hasBeenRedelivered(message: ConsumeMessage) {
		return (
			message.properties.headers &&
			message.properties.headers["redelivery_count"] !== undefined
		);
	}
}
