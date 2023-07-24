module.exports = async (bot, ctx, result, back) => {
    let inline_keyboard = []

    for(let t in result.formats) {
        const media = result.formats[t]
        if(media && media.format_id && media.url) {
            let ext = ''
            if(media.audio_ext !== 'none') ext += media.audio_ext
            if(media.audio_ext !== 'none' && media.video_ext !== 'none') ext += ' + '
            if(media.video_ext !== 'none') ext += media.video_ext

            inline_keyboard.push([{
                text: `${ext ? '['+ext+'] ' : ''} ${media.format}`,
                callback_data: `media_${media.format_id}`
            }])
        }
    }
    inline_keyboard.push([{ text: `Back`, callback_data: 'back' }])

    await ctx.deleteMessage()
    await ctx.telegram.sendMessage(ctx.chat.id, result.title + '\nAvailable medias :', {
        reply_markup: JSON.stringify({ inline_keyboard })
    })

    for(let t in result.thumbnails) {
        const media = result.formats[t]
        if(media && media.format_id && media.url) {
            await bot.action(`media_${media.format_id}`, async ctx => {
                await ctx.replyWithDocument(media.url)
            })
        }
    }

    await bot.action('back', async () => {
        if(typeof back === 'function') {
            return await back(bot, ctx, result)
        }
    })
}