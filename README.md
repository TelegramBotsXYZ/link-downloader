# Link downloader bot

Download medias & thumbnails from any link supported by youtube-dl

## Usage
`/start` the bot

`/convert` and send the link

## Run the bot
`npm run start`

## Changelog
### v.1.2.0
- Display multiple links per row to reduce message height.
- Add a ✅ symbol to spot the best links easily.
- Remove m3u8 links from list.
- Display a warning message for playlist links.
- Add /convert link at the end of conversion message to convert another link quicker.
- If file cannot be sent through Telegram, send the link instead.
- Bugs fixes.
### V.1.1.0
- Add back button to each menu (description, medias links list, thumbnail list).
- Add a button to convert another link without manually running the `/convert` command.