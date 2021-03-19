#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AwsCdkSqsDlqAlertSlackStack } from '../lib/aws-cdk-sqs-dlq-alert-slack-stack';

const app = new cdk.App();
new AwsCdkSqsDlqAlertSlackStack(app, 'AwsCdkSqsDlqAlertSlackStack');
