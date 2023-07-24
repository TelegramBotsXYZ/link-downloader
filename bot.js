require('dotenv').config()
const youtubedl = require('youtube-dl-exec')
const { Telegraf } = require('telegraf')
const mainMenu = require('./menus/main')
const thumbnailsMenu = require('./menus/thumbnails')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command('start', ctx => {
    ctx.replyWithMarkdown('Welcome to the Link Downloader bot !' +
        '\n\nWith this bot, you can download any media from a link (ex. youtube, soundcloud, etc...).' +
        '\n\n👉️ Contact @TgBotsXyz to get your custom telegram bots !' +
        '\n\n*Instructions :*' +
        '\n\n/convert get medias from a link')
})

const convert = ctx => {
    ctx.reply('Please enter the link to convert :')

    bot.hears(new RegExp(/.*/), async convertCtx => {

        const waitText = await convertCtx.reply('Please wait...')

        let result = null
        try {
            result = await youtubedl(convertCtx.message.text, {
                dumpSingleJson: true,
                noCheckCertificates: true,
                noWarnings: true,
                preferFreeFormats: true,
                addHeader: [ 'referer:youtube.com', 'user-agent:googlebot' ]
            })
        } catch (e) {
            console.error(e)
        }

        await convertCtx.deleteMessage(waitText.message_id)

        if(result !== null) {
            await mainMenu(bot, convertCtx, result, convert)
        } else {
            return await convertCtx.reply('An error occurred, please check if your url is correct and try again.')
        }
    })
}

bot.command('/convert', convert)

bot.launch()

bot.catch(async ctx => {
    await bot.telegram.sendMessage(ctx.on?.payload?.chat_id, ctx.response?.description || 'An error occurred')
    await bot.telegram.sendMessage(ctx.on?.payload?.chat_id, `<a href="${ctx.on?.payload?.document || ''}">Direct URL</a>`, {
        parse_mode: 'html'
    })
})

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))