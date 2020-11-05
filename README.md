# BrowserBenk

This is a Chrome extension that allows you to input a sentence in Japanese, and it will use machine translation/text-to-speech to make flash cards.

Please make sure to check the audio and translations before you add the card as they are not always correct.

Each flash card will be tested in increasing difficulty:

1. Kanji, English -> Hiragana
2. English -> Kanji
3. Audio, English -> Kanji
4. Kanji, English -> Fill in (randomly) missing parts of the sentence
5. Audio -> Fill in (randomly) missing parts of the sentence
6. English -> Order all parts of the sentence

The order of the cards tested is decided each time a test is started. The cards are roughly ordered in decreasing difficulty. At some point, when the difficulty is maxed and the card has been marked correct enough times, it will no longer be tested.

The speed of the difficulty increase and test order can be tweaked in test.js

## Set-up

The following web services are used to generate new flash cards. The services are free, although technically the Google services are only free when used under specified thresholds. Once you get each API key, you will need to input your specific keys in settings/services.json

#### Yahoo Web Services Application

You will need to sign up for a Yahoo account and also "register the application" to get your API key. Warning: the site is in Japanese!

http://e.developer.yahoo.co.jp/webservices/register_application

#### Google Cloud Text-to-speech

You will need a Google account and also set up Google Cloud. It will require credit card details, although you should never use the service enough to be charged. Then you need to add the service to your account.

https://cloud.google.com/text-to-speech

#### Google Cloud Translate

Similarly, you will need to set up the Translate service.

https://cloud.google.com/translate
