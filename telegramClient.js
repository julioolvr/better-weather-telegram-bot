import request from 'request-promise';

const BASE_URL = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

export default class {
    sendMessage(text, chatId) {
        return request.post(`${BASE_URL}/sendMessage`, { form: { text: text, chat_id: chatId } });
    }
}
