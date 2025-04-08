const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('게임')
    .setDescription('주사위, 룰렛등의 게임을 즐길 수 있습니다.'),

    async execute(interaction) {
        const row = new ActionRowBuilder().addComponents(
            // 주사위 던지기
            new ButtonBuilder()
            .setCustomId('dice_btn')
            .setLabel('🎲 주사위 던지기')
            .setStyle(ButtonStyle.Primary),
      
            // 룰렛 돌리기
            new ButtonBuilder()
            .setCustomId('roulette_btn')
            .setLabel('🎡 룰렛 돌리기')
            .setStyle(ButtonStyle.Primary),
          )
      
          await interaction.reply({
            content: '원하는 게임을 플레이하세요!',
            components: [row],
          });
    },

    buttons: {
        dice_btn: async (interaction) => {
            const dice = Math.floor(Math.random() * 6) + 1;

            const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId('dice_btn')
            .setLabel('다시 하기')
            .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
            .setCustomId('delete_btn')
            .setLabel('메세지 삭제')
            .setStyle(ButtonStyle.Danger),
            )

            await interaction.update({
            content: `🎲 주사위 결과 : **${dice}**`,
            components: [row],
            });
        },

        roulette_btn: async (interaction) => {

            const row = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
              .setCustomId('roulette_ten')
              .setLabel('10%')
              .setStyle(ButtonStyle.Secondary),
        
              new ButtonBuilder()
              .setCustomId('roulette_quarter')
              .setLabel('25%')
              .setStyle(ButtonStyle.Secondary),
        
              new ButtonBuilder()
              .setCustomId('roulette_half')
              .setLabel('50%')
              .setStyle(ButtonStyle.Secondary),
            )
        
            await interaction.update({
              content: '확률을 선택하시오.',
              components: [row]
            })
        },

        // 룰렛 10퍼센트
        roulette_ten: async (interaction) => {
            const randomWinNum = getRandomNumbers(10);
            
            const num = Math.floor(Math.random() * 100) + 1;
        
            const win = randomWinNum.includes(num) ? 'Win ! 😊' : 'Lose 😥' ;
        
            const row = new ActionRowBuilder().addComponents(
        
              new ButtonBuilder()
              .setCustomId('roulette_btn')
              .setLabel('다시 하기')
              .setStyle(ButtonStyle.Primary),
        
              new ButtonBuilder()
              .setCustomId('delete_btn')
              .setLabel('메세지 삭제')
              .setStyle(ButtonStyle.Danger),
            )
        
            await interaction.update({
              content: `${win}`,
              components: [row]
            })
          },
        
        // 룰렛 25퍼센트
        roulette_quarter: async (interaction) => {
            const randomWinNum = getRandomNumbers(25);
            
            const num = Math.floor(Math.random() * 100) + 1;
        
            const win = randomWinNum.includes(num) ? 'Win ! 😊' : 'Lose 😥' ;
        
            const row = new ActionRowBuilder().addComponents(
        
              new ButtonBuilder()
              .setCustomId('roulette_btn')
              .setLabel('다시 하기')
              .setStyle(ButtonStyle.Primary),
        
              new ButtonBuilder()
              .setCustomId('delete_btn')
              .setLabel('메세지 삭제')
              .setStyle(ButtonStyle.Danger),
            )
        
            await interaction.update({
              content: `${win}`,
              components: [row]
            })
        },
        
        // 룰렛 50퍼센트
        roulette_half: async (interaction) => {
            const randomWinNum = getRandomNumbers(50);
            
            const num = Math.floor(Math.random() * 100) + 1;
        
            const win = randomWinNum.includes(num) ? 'Win ! 😊' : 'Lose 😥' ;
        
            const row = new ActionRowBuilder().addComponents(
        
              new ButtonBuilder()
              .setCustomId('roulette_btn')
              .setLabel('다시 하기')
              .setStyle(ButtonStyle.Primary),
        
              new ButtonBuilder()
              .setCustomId('delete_btn')
              .setLabel('메세지 삭제')
              .setStyle(ButtonStyle.Danger),
            )
        
            await interaction.update({
              content: `${win}`,
              components: [row]
            })
        }, // 룰렛 버튼 끝
    }
};

// 1부터 100까지 중에 n개의 숫자 뽑는 함수
function getRandomNumbers(n) {
  const numbers = Array.from({ length : 100 }, (_, i) => i + 1);
  const result = [];

  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    result.push(numbers[randomIndex]);
    numbers.splice(randomIndex, 1);
  }

  return result;
};