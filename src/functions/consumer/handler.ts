import type  {SQSEvent, SQSRecord} from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { consumerBusiness } from '../../business/consumer.business'

const consume = async (event: SQSEvent) =>{
    console.log(`Processing Data From Queue with Records ${JSON.stringify(event.Records)}`);
    const batchItemFailures =[];
    await Promise.allSettled(
        event.Records.map(async (record: SQSRecord) =>{
        const body = record.body;
        try{
          consumerBusiness(body);
        }catch(e){
          console.log(`Error in processing SQS consumer: ${body}`);
          batchItemFailures.push({itemIdentifier: record.messageId});
        }
      })
    )
    return {batchItemFailures};
  }


export const main = middyfy(consume);