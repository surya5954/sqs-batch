import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { SQS } from 'aws-sdk';
import schema from './schema';
import { producerBusiness } from '../../business/produces.business';



const producer: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try{
        const {batchQueueUrl} = process.env;
        const batchMessages = producerBusiness({...event.body}, batchQueueUrl);
        console.log(`MessageBody Published to SQS: ${JSON.stringify(batchMessages)}`)

        const sqs = new SQS();
        for(const batchMessage of batchMessages){
            await sqs.sendMessageBatch(batchMessage).promise();
        }

        console.log("Message published to Queue");
        return formatJSONResponse({
            message: `Send SQS message with total Batchs of ${event.body.numberOfBatch}, each batches having 10 messages !`,
            queueUrl: batchQueueUrl
        });
     }catch(e){
        console.log(e);
     }
};


export const main = middyfy(producer);
