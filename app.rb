require 'sinatra'
require 'json'
require 'chronic'
require 'net/http'

TELEGRAM_API_BASE_PATH = "https://api.telegram.org/bot#{ENV['BOT_TOKEN']}"

post '/update' do
  update = JSON.parse(request.body.read)
  message = update['message']['text']
  id = update['message']['chat']['id']
  return unless message

  reminder_matches = /remind me to (.+?) (?:at|on|in) (.+)/i.match(message).to_a.drop(1)
  remind_what = reminder_matches.first
  remind_when = Chronic.parse(reminder_matches.last)

  if remind_when
    send_message("Ok, I'll remind you to #{remind_what} on #{remind_when.to_s}", id)
  else
    send_message('I didn\'t understand!', id)
  end
end

def send_message(text, chat_id)
  uri = URI("#{TELEGRAM_API_BASE_PATH}/sendMessage")
  Net::HTTP.post_form(uri, chat_id: chat_id, text: text)
end
