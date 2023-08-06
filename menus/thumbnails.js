module.exports = async (bot, ctx, result, back) => {
    let inline_keyboard = []

    const groupSize = 4
    for (let t = 0; t < result.thumbnails.length; t += groupSize) {
        const group = [];
        for (let j = 0; j < groupSize && t + j < result.thumbnails.length; j++) {
            const thumb = result.thumbnails[t + j];
            group.push({
                text: `${thumb.preference === 0 ? '✅ ' : ''}${thumb.id} ${thumb.resolution ? `(${thumb.resolution})` : ''}`,
                callback_data: `thumb_${thumb.id}`
            });
        }
        inline_keyboard.push(group);
    }

    inline_keyboard.push([{ text: `Back`, callback_data: 'back' }])

    await ctx.deleteMessage()
    await ctx.telegram.sendMessage(ctx.chat.id, result.title + '\nAvailable thumbnails :', {
        reply_markup: JSON.stringify({ inline_keyboard })
    })

    for(let t in result.thumbnails) {
        const thumb = result.thumbnails[t]

        await bot.action(`thumb_${thumb.id}`, async ctx => {
            await ctx.replyWithDocument(thumb.url)
        })
    }

    await bot.action('back', async () => {
        if(typeof back === 'function') {
            return await back(bot, ctx, result)
        }
    })
}