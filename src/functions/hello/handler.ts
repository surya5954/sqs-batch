import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { SQS } from 'aws-sdk';

import schema from './schema';

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try{
        const { batchQueueUrl }  = process.env;
    
        const sqs = new SQS();
        const batchMessages = [];
    
        for(let msg= 0; msg < 5;msg++){
            batchMessages.push({
                Entries: [
                    ...new Array(10).fill(0).map((_, index) =>{
                        return {
                            Id: 'messageId_'+ (index + 10 * msg),
                            MessageBody: `${index + 10 * msg}`,
                        }
                    })
                ],
                QueueUrl: batchQueueUrl,
            })
        }
       
        

        console.log(`MessageBody Published to SQS: ${JSON.stringify(batchMessages)}`)
        for(const batchMessage of batchMessages){
            await sqs.sendMessageBatch(batchMessage).promise();
        }
        console.log("Message published to Queue");
        return formatJSONResponse({
            message: `Hello Sir! ${event.body.name}, welcome to the exciting Serverless world!`,
            batchQueueUrl
        });
     }catch(e){
        console.log(e);
     }
};

export const main = middyfy(hello);
