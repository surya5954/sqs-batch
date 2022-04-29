import type  {SQSEvent, SQSRecord} from 'aws-lambda';
import { middyfy } from '@libs/lambda';


const consumerBusiness = (body) =>{
    if(Number(body) % 2 === 0 ){
        console.log(`Queue Successfully processed for message body: ${body}`);
    }else{
        throw Error;
    }
}

const consume = async (event: SQSEvent) => {
    console.log(`Processing data from queue with records ${JSON.stringify(event.Records)}`)
    const batchItemFailures = [];
    await Promise.allSettled(
        event.Records.map(async (record: SQSRecord ) =>{
            const body = record.body;
            try{
                consumerBusiness(body);
            }catch(e){
                console.log(`Error in processing SQS consumer: ${body}`);
                batchItemFailures.push({ itemIdentifier: record.messageId });
            }

        })
    )
    return {batchItemFailures};
  }




export const main = middyfy(consume);