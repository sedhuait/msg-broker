import { Producer } from "./producer";
import { Consumer } from "./consumer";
import 'dotenv/config'
const {QUEUE_URL, PRODUCERS = 2, CONSUMERS = 2, PRODUCER_INTERVAL= 2, CONSUMER_INTERVAL = 2} = process.env;
console.log('Msg broker url:', QUEUE_URL);

if (!QUEUE_URL)
{
    console.error("Invalid server");
    process.exit(1);
}

for (let i = 0; i < PRODUCERS; i++)
{
    Producer.startProducing(QUEUE_URL, Number(PRODUCER_INTERVAL));
}

for (let i = 0; i < CONSUMERS; i++)
{
    Consumer.startConsuming(QUEUE_URL, Number(CONSUMER_INTERVAL));
}
