// index.js
const { Client, GatewayIntentBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Events } = require('discord.js');
const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const TOKEN = process.env.DISCORD_TOKEN;

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// 명령어 처리
client.on('messageCreate', message => {
  const prefix = '*';
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const [command, ...args] = message.content.slice(prefix.length).trim().split(/ +/);

  // 정보 명령어
  if (command === '정보') {
    const embed = new EmbedBuilder()
      .setTitle('봇 정보')
      .setDescription('이 봇은 다양한 기능을 지원해요!')
      .setColor(0x00AE86)
      .addFields(
        { name: '개발자', value: '나그네' },
        { name: '명령어', value: '정보, 버튼' }
      )
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  }
  
  // 인사 버튼 명령어
  else if (command === '버튼') {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
      .setCustomId('hello_btn')
      .setLabel('👋 인사')
      .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
      .setCustomId('bye_btn')
      .setLabel('👋 작별인사')
      .setStyle(ButtonStyle.Secondary),
    );

    message.channel.send({
      content: '아래 버튼 중 하나를 눌러 상호작용을 해보세요!',
      components: [row],
    });
  }

  // 주사위 굴리기 버튼 명령어
  else if (command === '주사위') {
    const button = new ButtonBuilder()
      .setCustomId('dice_btn')
      .setLabel('🎲 주사위 던지기')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    message.channel.send({
      content: '버튼을 눌러 주사위를 굴리세요!',
      components: [row],
    });
  }

  // 채팅창 청소 명령어
  else if (command === '청소') {
    if (!message.member.permissions.has('ManageMessages')) {
      return message.reply('메세지를 삭제할 권한이 없습니다.');
    }

    const amount = parseInt(args[0], 10);

    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply('1부터 100 사이 숫자를 입력해주세요.');
    }

    message.channel.bulkDelete(amount + 1, true)
    .then(deleted => {
      message.channel.send(`${deleted.size - 1}개의 메세지를 삭제했어요!`)
      .then(msg => setTimeout(() => msg.delete(), 5000));
    })
    .catch(err => {
      console.error(err);
      message.reply('메세지를 삭제하는 데 실패했어요!');
    });
  }
})

// 버튼 종류
const buttonHandlers = {

  // 인사 버튼
  hello_btn: async (interaction) => {
    await interaction.reply({
      content: '안녕하세요! 👋',
      ephemeral: true,
    });
  },

  // 작별 인사 버튼
  bye_btn: async (interaction) => {
    await interaction.reply({
      content: '안녕히 가세요 🥲',
      ephemeral: true,
    });
  },

  // 주사위 버튼
  dice_btn: async (interaction) => {
    const dice = Math.floor(Math.random() * 6) + 1;

    const originalMessage = interaction.message;

    await originalMessage.edit({
      content: `주사위 결과 : **${dice}**`,
      components: [],
    });
  },
};

// 버튼 상호작용
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;

  const handler = buttonHandlers[interaction.customId];
  if (handler) {
    await handler(interaction);
  } else {
    await interaction.reply({
      content: '알 수 없는 버튼입니다.',
      ephemeral: true,
    });
  }
});
  

client.login(TOKEN);