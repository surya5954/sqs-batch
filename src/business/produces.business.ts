export const producerBusiness = ({numberOfBatch, delaySeconds = 0}, queueUrl) =>{
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
                QueueUrl: queueUrl,
            })
        }
        return batchMessages;
}