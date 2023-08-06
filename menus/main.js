const numeral = require('numeral')
const thumbnailsMenu = require('./thumbnails')
const mediasMenu = require('./medias')
const nbrFormat = '0.0 a'

module.exports = async (bot, ctx, result, convert) => {
    let text = `<b>${result?.fulltitle ?? result?.title}</b>\n`

    if(result?.extractor_key) text += `\nFrom ${result.extractor_key}\n`

    if(result?.display_id) text += `\n<b>Identifier :</b> ${result.display_id}`
    if(result?.duration_string) text += `\n<b>Duration :</b> ${result.duration_string}`
    if(result?.genre) text += `\n<b>Genre :</b> ${result.genre}`
    if(result?.resolution) text += `\n<b>Resolution :</b> ${result.resolution}`
    if(result?.view_count) text += `\n<b>Views :</b> ${numeral(result.view_count).format(nbrFormat)}`
    if(result?.like_count) text += `\n<b>Likes :</b> ${numeral(result.like_count).format(nbrFormat)}`
    if(result?.comment_count) text += `\n<b>Comments :</b> ${numeral(result.comment_count).format(nbrFormat)}`
    if(result?.repost_count) text += `\n<b>Reposts :</b> ${numeral(result.repost_count).format(nbrFormat)}`

    if(result?.uploader) text += `\n\n<b>Uploader :</b> <a href="${result.uploader_url}">${result.uploader}</a>`
    if(result?.channel) text += `\n<b>Channel :</b> <a href="${result.channel_url}">${result.channel}</a>`
    if(result?.channel_follower_count) text += `\n<b>Channel followers :</b> ${numeral(result.channel_follower_count).format(nbrFormat)}`
    if(result?.upload_date) text += `\n<b>Upload date :</b> ${result.upload_date.replace(/.{1,4}(?=(.{2})+$)/g, '$&/')}`

    if(result?.license) text += `\n\n<b>License : ${result?.license}</b>`

    if(result._type === 'playlist') {
        text += `\n\n<b>${result.playlist_count + (result.playlist_count === 50 ? '+' : '')}</b>`
        text += `\n\n<b>⚠ Warning : the link provided is a playlist link, this bot cannot convert a full playlist.</b>`
        text += `\nIf you think that your link is not a playlist link, please use the original shareable link, without extra parameters`
    }

    text += `\n\n➡ /convert another link`

    await ctx.telegram.sendMessage(ctx.chat.id, text, {
        parse_mode: 'html',
        disable_web_page_preview: true,
        reply_markup: JSON.stringify({
            inline_keyboard: result._type === 'playlist' ? [] : [
                ...(result?.description ? [[{ text: 'View full description', callback_data: 'description' }]] : []),
                [{ text: `Download medias`, callback_data: 'downloads' }],
                [{ text: `Download thumbnails`, callback_data: 'thumbnails' }]
            ]
        })
    })

    /*await bot.action('again', async ctx => {
        if(typeof convert === 'function') {
            result = null
            return await convert(ctx)
        }
    })*/

    await bot.action('description', async ctx => {
        ctx.editMessageText(result?.description, {
            disable_web_page_preview: true,
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: `Back`, callback_data: 'back' }]
                ]
            })
        })

        await bot.action('back', async () => {
            return await module.exports(bot, ctx, result)
        })
    })


    await bot.action('downloads', async ctx => {
        await mediasMenu(bot, ctx, result, module.exports)
    })

    await bot.action('thumbnails', async ctx => {
        await thumbnailsMenu(bot, ctx, result, module.exports)
    })
}