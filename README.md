# visuals-2018

How to run:

- Go to the base folder (where this README is)

- Run a local server
  - Python: ```python -m SimpleHTTPServer 8080```
  - PHP: ```php -S 0.0.0.0:8080```
  - http-server:
    - ```npm install http-server -g```
    - ```http-server . 8080```

- Open browser and go to ```localhost:8080```

- From DevTools console you can:
  - Show a speakers' intro: ```visuals.speaker.selectSpeaker(speakerId)```
    - Speakers ids, names, talks, etc. are defined on /assets/speakers.js
    - To help with this, ```visuals.speaker.names``` is an enum of all names, can autocomplete.
    - example: ```visuals.speaker.selectSpeaker(visuals.speaker.names.elisabethengel)```
