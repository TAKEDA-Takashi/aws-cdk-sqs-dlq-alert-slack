#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AwsCdkSqsDlqAlertSlackStack } from '../lib/aws-cdk-sqs-dlq-alert-slack-stack';

const env = {
    region: 'ap-northeast-1',
};

const app = new cdk.App();
new AwsCdkSqsDlqAlertSlackStack(app, 'AwsCdkSqsDlqAlertSlackStack', {
    env,
});
