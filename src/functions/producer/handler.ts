import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { SQS } from 'aws-sdk';

import schema from './schema';

const producer: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try{
        const { batchQueueUrl }  = process.env;
        const {numberOfBatch, delaySeconds } = event.body;
        const sqs = new SQS();
        const batchMessages = [];
    
        for(let msg= 0; msg < numberOfBatch; msg++){
            batchMessages.push({
                Entries: [
                    ...new Array(10).fill(0).map((_, index) =>{
                        return {
                            Id: 'messageId_'+ (index + 10 * msg),
                            MessageBody: `${index + 10 * msg}`,
                            DelaySeconds: delaySeconds
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
            message: `Send SQS message with total Batchs of ${numberOfBatch}, each batches having 10 messages !`,
            batchQueueUrl
        });
     }catch(e){
        console.log(e);
     }
};

export const main = middyfy(producer);
