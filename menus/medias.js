module.exports = async (bot, ctx, result, back) => {
    let inline_keyboard = []

    const groupSize = 4;

    result.formats = result.formats.sort((a, b) => parseInt(a.audio_channels ?? 0) - parseInt(b.audio_channels ?? 0))
    for (let i = 0; i < result.formats.length; i += groupSize) {
        const row = [];
        for (let j = 0; j < groupSize; j++) {
            const media = result.formats[i + j]
            if(media && media.format_id && media.url) {
                let ext = ''
                if (media.audio_ext !== 'none') ext += media.audio_ext
                if (media.audio_ext !== 'none' && media.video_ext !== 'none') ext += ' + '
                if (media.video_ext !== 'none') ext += media.video_ext

                if(media.protocol !== 'm3u8_native' && (!result.extractor.startsWith('youtube') || media.width !== null && media.width > 400)) {
                    row.push({
                        text: `${ext ? '[' + ext + '] ' : ''} ${media.format_note ?? media.format} ${result.extractor.startsWith('youtube')
                            ? (media.audio_channels === null ? '(no audio)' : '✅') : ''}`,
                        callback_data: `media-${media.format_id}`
                    });
                }
            }
        }
        inline_keyboard.push([].concat(...row));
    }
    inline_keyboard.push([{ text: `Back`, callback_data: 'back' }])

    await ctx.deleteMessage()
    await ctx.telegram.sendMessage(ctx.chat.id, result.title + '\nAvailable medias :', {
        reply_markup: JSON.stringify({ inline_keyboard })
    })

    for(let t in result.formats) {
        const media = result.formats[t]
        await bot.action(`media-${media.format_id}`, async ctx => {
            try {
                await ctx.sendDocument(ctx.chat.id, media.url)
            } catch (e) {
                await ctx.replyWithHTML(`Here is the <a href="${media.url}">direct URL</a> of the file !`)
            }
        })
    }

    await bot.action('back', async () => {
        if(typeof back === 'function') {
            return await back(bot, ctx, result)
        }
    })
}