import axios from "axios";
import { v4 } from 'uuid';
import { randCatchPhrase } from '@ngneat/falso';


export class Producer {
    private static timer: NodeJS.Timer;
    private static async sendMessage(url:string) {
        const msg = {
            id: v4(),
            timestamp: new Date().toISOString(),
            payload: JSON.stringify({ txt: randCatchPhrase({ length: 25 }) })
        };
        console.log("Msg produced ==>", msg.id);
        await axios.post(`${url}/messages`, msg);
    }

    public static startProducing(url:string, interval = 1) {
        Producer.timer = setInterval(Producer.sendMessage.bind(this, url), interval * 1000);
    }

    public static stopProducing() {
        clearInterval(Producer.timer);
    }
}