require 'sinatra'
require 'json'
require 'net/http'
require 'emoji'

TELEGRAM_API_BASE_PATH = "https://api.telegram.org/bot#{ENV['BOT_TOKEN']}"
OWM_API_KEY = ENV['OWM_API_KEY']

post '/update' do
  update = JSON.parse(request.body.read)
  message = update['message']['text']
  id = update['message']['chat']['id']
  return unless message

  weather = weather_for(message)

  unless weather['cod'] == '200'
    return send_message('I couldn\'t find that place', id)
  end

  response = ["Weather for the next days in #{weather['city']['name']}:"].concat(weather['list'].map { |day| "#{Time.at(day['dt']).strftime('%A')}: #{message_for_weather(day['weather'].first)}" })
  send_message(response.join("\n"), id)
end

def send_message(text, chat_id)
  uri = URI("#{TELEGRAM_API_BASE_PATH}/sendMessage")
  Net::HTTP.post_form(uri, chat_id: chat_id, text: text)
end

def weather_for(query)
  uri = URI("http://api.openweathermap.org/data/2.5/forecast/daily?q=#{URI.escape(query)}&cnt=3&APPID=#{OWM_API_KEY}")
  JSON.parse(Net::HTTP.get(uri))
end

def message_for_weather(weather)
  case weather['id']
  when 800
    "#{Emoji.find_by_alias('sunny').raw} clear"
  when 500, 501, 502, 503, 504, 511, 520, 521, 522, 531
    "#{Emoji.find_by_alias('umbrella').raw} #{weather['description']}"
  when 801, 802, 803, 804
    "#{Emoji.find_by_alias('cloud').raw} #{weather['description']}"
  when 200, 201, 202, 210, 211, 212, 221, 230, 231, 232
    "#{Emoji.find_by_alias('zap').raw} #{weather['description']}"
  else
    "#{Emoji.find_by_alias('question').raw} #{weather['description']}"
  end
end
