import axios from "axios";


export class Consumer {
    private static timer: NodeJS.Timer;
    private static async pollMessages(url: string) {

        const { data } = await axios.get(`${url}/messages`);
        if (data.message?.id) {
            console.log("Msg Consumed <==", { id: data.message.id, remaining: data.messagesLeft });
            await axios.patch(`${url}/messages/${data.message.id}`);
        } else {
            console.log("Msg remaining", data.messagesLeft);
        }
    }

    public static startConsuming(url:string, interval = 3) {
        Consumer.timer = setInterval(Consumer.pollMessages.bind(this, url), interval * 1000);
    }

    public static stopConsuming() {
        clearInterval(Consumer.timer);
    }
}