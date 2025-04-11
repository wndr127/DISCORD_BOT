const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, Embed, ActionRow, time, MessageFlags } = require("discord.js");
const fs = require('fs');
const hwPath = './hw.json';

let hw_list = [];

try {
    hw_list = JSON.parse(fs.readFileSync('./hw.json'));
} catch (err) {
    console.log('과제 데이터가 없어 새로 시작합니다.');
    hw_list = [];
}

function saveHwList() {
    fs.writeFileSync(hwPath, JSON.stringify(hw_list, null, 2));
}

function createHwEmbed() {
    return new EmbedBuilder()
        .setColor('80E12A')
        .setTitle('📃 과제 목록')
        .setDescription('과제를 수행하고 경험치를 얻어보세요!')
        .addFields(
            hw_list.length ?
            hw_list.map((task, idx) => ({
                name: `과제 ${idx + 1}`,
                value: task,
            })) 
            : [{
                name: '현재 등록된 과제가 없습니다.',
                value: '추가 버튼을 눌러 과제를 추가해보세요.' 
            }]
        );
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('과제')
    .setDescription('과제 정리를 도와드리겠습니다!'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
        .setColor('80E12A')
        .setTitle('과제')
        .setDescription("과제를 돕기 위한 명령어")
        .setFields(
        { name: '**+ 목록**', value: '과제를 목록을 확인합니다.' },
        { name: '**+ 등록**', value: '과제를 등록합니다.' },
        { name: '**+ 수정**', value: '등록된 과제 내용을 수정합니다.' },
        { name: '**+ 완료**', value: '등록된 과제를 완료상태로 표시합니다.' },
        { name: '**+ 삭제**', value: '등록된 과제를 삭제합니다.' },
        )

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('hw_list_btn')
                .setLabel('📃 목록')
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId('hw_add_btn')
                .setLabel('✏️ 추가')
                .setStyle(ButtonStyle.Secondary),
            
            new ButtonBuilder()
                .setCustomId('hw_modify_btn')
                .setLabel('🔧 수정')
                .setStyle(ButtonStyle.Secondary),
            
            new ButtonBuilder()
                .setCustomId('hw_complete_btn')
                .setLabel('🏆 완료')
                .setStyle(ButtonStyle.Success),
        )

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('delete_btn')
                .setLabel('메세지 삭제')
                .setStyle(ButtonStyle.Danger), 
        )

    await interaction.reply({ embeds: [embed], components: [row1, row2] });
  
    },

    buttons: {
        hw_list_btn: async (interaction) => {
            const embed = createHwEmbed();

            const row1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId('hw_add_btn')
                .setLabel('✏️ 과제 추가')
                .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                .setCustomId('hw_remove_btn')
                .setLabel('❌ 과제 삭제')
                .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                .setCustomId('hw_complete_btn')
                .setLabel('🏆 과제 완료')
                .setStyle(ButtonStyle.Success),
            )

            const row2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId('delete_btn')
                .setLabel('메세지 삭제')
                .setStyle(ButtonStyle.Danger),
            );

            await interaction.update({ embeds: [embed], components: [row1, row2] })
        },

        hw_modify_btn: async (interaction) => {
            
        },

        hw_complete_btn: async (interaction) => {
            
        },

        hw_add_btn: async (interaction) => {
            const row1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId('hw_add_btn')
                .setLabel('✏️ 과제 추가')
                .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                .setCustomId('hw_remove_btn')
                .setLabel('❌ 과제 삭제')
                .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                .setCustomId('hw_complete_btn')
                .setLabel('🏆 과제 완료')
                .setStyle(ButtonStyle.Success),
            )

            const row2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId('delete_btn')
                .setLabel('취소')
                .setStyle(ButtonStyle.Danger),
            )
            await interaction.update({ content: '추가 할 과제를 입력하세요.', embeds: [], components: [row2] })

            const filter = m => m.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 15000, max: 1 });

            collector.on('collect', async msg => {
                hw_list.push(`📌 ${msg.content}`);

                fs.writeFileSync(hwPath, JSON.stringify(hw_list, null, 2));

                const embed = createHwEmbed();
                await interaction.editReply({ embeds: [embed], content: '', components: [row1, row2] });
                msg.delete().catch(console.error);
            });

        },

        hw_remove_btn: async (interaction) => {

            const row1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId('hw_add_btn')
                .setLabel('✏️ 과제 추가')
                .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                .setCustomId('hw_remove_btn')
                .setLabel('❌ 과제 삭제')
                .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                .setCustomId('hw_complete_btn')
                .setLabel('🏆 과제 완료')
                .setStyle(ButtonStyle.Success),
            )

            const row2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId('delete_btn')
                .setLabel('취소')
                .setStyle(ButtonStyle.Danger),
            )

            const delete_list_embed = new EmbedBuilder()
                .setColor('80E12A')
                .setTitle('📃 과제 목록')
                .setDescription('삭제할 과제의 번호를 입력하세요.')
                .addFields(
                    hw_list.map((task, idx) => ({
                    name: `과제 ${idx + 1}`,
                    value: task,
                })));

            if (hw_list.length < 1) {
                await interaction.update({ embeds: [], content: '삭제할 과제가 없습니다.', components: [row2]});
            } else {
                await interaction.update({ content: '', embeds: [delete_list_embed], components: [row2]});
            }

            const filter = m => m.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 15000, max: 1 });

            collector.on('collect', async msg => {
                const index = parseInt(msg.content);

                if (isNaN(index)) {
                    msg.reply({ content: '숫자를 입력해주세요.', embeds: [], components: [] }).then(m => setTimeout(() => m.delete(), 5000));
                    await interaction.editReply({ embeds: [createHwEmbed()], components: [row1, row2] });
                    return;
                }

                msg.delete().catch(console.error);
    
                const data = JSON.parse(fs.readFileSync(hwPath, 'utf-8'));

                if (index < 1 || index > data.length) {
                    await msg.reply({ content: `범위 내의 숫자를 입력해주세요. (1 ~ ${data.length})`, flags: MessageFlags.Ephemeral});
                    return ; 
                }

                const removed = data.splice(index - 1, 1);
                fs.writeFileSync(hwPath, JSON.stringify(data, null, 2));

                interaction.message.delete().catch(console.error);
                await msg.channel.send({ embeds: [createHwEmbed()], components: [row1, row2] });
            });
        },
    }
}