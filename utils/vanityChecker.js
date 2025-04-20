import axios from 'axios';

export async function checkAndSnipeVanity(bot, config) {
  const desired = config.vanity;
  const intervalMs = (config.interval || 5) * 1000;

  const headers = {
    Authorization: `Bot ${config.token}`
  };

  setInterval(async () => {
    try {
      const res = await axios.get(`https://discord.com/api/v10/invites/${desired}`, { headers });

      const currentGuildId = res.data.guild.id;

      if (currentGuildId === config.guildId) {
        console.log(`[✅] URL zaten sana ait: ${desired}`);
      } else {
        console.log(`[❌] Şu an başka bir sunucuda: ${currentGuildId}`);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.log(`[💥] URL BOŞTA! Almaya çalışılıyor...`);

        try {
          await axios.patch(
            `https://discord.com/api/v10/guilds/${config.guildId}/codejs-url`,
            { code: desired },
            { headers }
          );

          console.log(`[🚀] ALINDI! ${desired} artık senin!`);

          const owner = await bot.users.fetch(bot.application.owner.id);
          await owner.send(`✅ **URL Alındı:** \`discord.gg/${desired}\` artık senin! 🎉`);
        } catch (e) {
          console.log(`[😵] Alırken hata: ${e.response?.data?.message || e.message}`);
        }
      } else {
        console.log(`[⚠️] Sorgularken hata: ${err.message}`);
      }
    }
  }, intervalMs);
}
