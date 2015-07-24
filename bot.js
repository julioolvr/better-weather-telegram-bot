import OwmClient from './owmClient';
import TelegramClient from './telegramClient';
import EmojiDb from './emoji';
import moment from 'moment';

const owmClient = new OwmClient();
const telegramClient = new TelegramClient();

function messageIsCommand(message) {
    return message.text && message.text.startsWith('/');
}

export default class {
    messageForForecast(forecast) {
        if (forecast.id === 800) {
            return `${EmojiDb.unicodeForAlias('sunny')} clear`;
        }

        let emoji;

        if (forecast.id >= 500 && forecast.id < 600) {
            emoji = EmojiDb.unicodeForAlias('umbrella');
        } else if (forecast.id >= 801 && forecast.id < 900) {
            emoji = EmojiDb.unicodeForAlias('cloud');
        } else if (forecast.id >= 200 && forecast.id < 300) {
            emoji = EmojiDb.unicodeForAlias('zap');
        } else {
            emoji = EmojiDb.unicodeForAlias('question');
        }

        return `${emoji} ${forecast.description}`;
    }

    respondTo(message) {
        let promise;

        if (messageIsCommand(message)) {
            return telegramClient.sendMessage(this.respondToCommand(message.text), message.chat.id);
        }

        if (message.location) {
            promise = owmClient.weatherForLocation(message.location.latitude, message.location.longitude);
        } else {
            promise = owmClient.weatherForText(message.text);
        }

        return promise.then(response => {
            const answer = [`Weather for the next days in ${response.city.name}:`].concat(response.list.map((forecast) => {
                const day = moment.unix(forecast.dt).format('dddd');
                return `${day}: ${this.messageForForecast(forecast.weather[0])}`;
            })).join('\n');

            telegramClient.sendMessage(answer, message.chat.id);
        }).catch(() => {
            telegramClient.sendMessage('I couldn\'t find that place', message.chat.id);
        });
    }

    respondToCommand(command) {
        switch (command) {
        case '/start':
            return 'Just tell me a place or send me a location and I\'ll tell you the weather!';
        }
    }
}
