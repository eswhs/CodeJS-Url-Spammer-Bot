import { Client, GatewayIntentBits } from 'discord.js';
import { checkAndSnipeVanity } from './utils/vanityChecker.js';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', async () => {
  console.log(`Bu bot CodeJS tarafından yapılmıştır. ${client.user.tag}`);

  await client.application.fetch();

  checkAndSnipeVanity(client, config);
});

client.login(config.token);
