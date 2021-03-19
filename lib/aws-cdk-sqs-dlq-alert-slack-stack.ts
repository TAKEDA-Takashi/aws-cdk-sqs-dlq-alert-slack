import { SlackChannelConfiguration } from '@aws-cdk/aws-chatbot';
import { Alarm, TreatMissingData } from '@aws-cdk/aws-cloudwatch';
import { SnsAction } from '@aws-cdk/aws-cloudwatch-actions';
import { Topic } from '@aws-cdk/aws-sns';
import { Queue } from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';

export class AwsCdkSqsDlqAlertSlackStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // SQS
    const testQueueDlq = new Queue(this, 'TestQueue-DLQ', {
      queueName: 'TestQueue-DLQ',
    });

    const testQueue = new Queue(this, 'TestQueue', {
      queueName: 'TestQueue',
      deadLetterQueue: {
        maxReceiveCount: 1,
        queue: testQueueDlq,
      },
    });

    // SNS
    const chatbotNotificationTopic = new Topic(this, 'ChatbotNotificationTopic', {
      topicName: 'ChatbotNotificationTopic',
    });

    // CloudWatch
    const alarm = new Alarm(this, `TestQueue-DLQ-Alarm`, {
      metric: testQueueDlq.metricApproximateNumberOfMessagesVisible(),
      evaluationPeriods: 1,
      threshold: 1,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    });

    alarm.addAlarmAction(new SnsAction(chatbotNotificationTopic));
    alarm.addOkAction(new SnsAction(chatbotNotificationTopic));

    // Chatbot
    new SlackChannelConfiguration(this, 'SlackChannel', {
      slackChannelConfigurationName: 'sandbox',
      slackWorkspaceId: 'T03XXXXXX',
      slackChannelId: 'CFG000000',
      notificationTopics: [chatbotNotificationTopic],
    });
  }
}
