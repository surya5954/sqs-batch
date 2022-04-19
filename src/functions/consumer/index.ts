import { handlerPath } from '@libs/handler-resolver';
import { AWS } from '@serverless/typescript';

export default {
        handler: `${handlerPath(__dirname)}/handler.main`,
        events: [
            {
                sqs:{
                    arn:{
                        'Fn::GetAtt': ['DemoBatchQueue', 'Arn'],
                    }, 
                    batchSize: 20, // Default batchsize is 10
                    maximumBatchingWindow: 60,
                    functionResponseType: 'ReportBatchItemFailures',
                }
            },
        ],
  
} as AWS['functions'];
