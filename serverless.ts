import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import queueHandler from '@functions/consumer'

const serverlessConfiguration: AWS= {
  service: 'sqs-batch',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { hello, queueHandler},
  resources:{
    Resources:{
      DemoBatchQueue:{
          Type: 'AWS::SQS::Queue',
          Properties:{
              QueueName: 'demo-batch-queue',
              VisibilityTimeout: 30,
              MessageRetentionPeriod: 345600,
              RedrivePolicy:{
                  deadLetterTargetArn: {
                      'Fn::GetAtt': ['DemoBatchDLQ', 'Arn'],
                  },
                  maxReceiveCount: 10
              }
          }
      },
      DemoBatchDLQ:{
          Type: 'AWS::SQS::Queue',
          Properties: {
              QueueName: 'demo-batch-dlq'
          }
      }
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
