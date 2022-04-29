export const consumerBusiness = (body) =>{
    if(Number(body) % 2 === 0 ){
        console.log(`Queue Successfully processed for message body: ${body}`);
    }else{
        throw Error;
    }
}