const Discord = require('discord.js');
const os

const CHANNEL = 'log';
const VERSION = '0.0.1';

console.log('로거봇 버전:' + VERSION);
console.log('The bots copyright is Heasy Official.\n');
console.log('----------------------------------------------');

console.log('[META][정보] 로거봇이 실행되었습니다. 실행된 버전:' + VERSION);


var bot = new Discord.Client();


bot.on('ready', function() {
    console.log('[META][정보] 디스코드 API와 연결중입니다.');
});

bot.on('disconnected', function() {
    console.log('[META][경고] Discord API 서비스와의 연결이 끊어졌습니다. 다시 연결하려고합니다 ...');
});

bot.on('warn', function(msg) {
    console.log('[META][경고] ' + msg);
});

bot.on('error', function(err) {
    console.log('[META][에러] ' + err.message);
    process.exit(1);
});

bot.on('messageDelete', function(message) {

    if(message.channel.type == 'text') {

        console.log('[' + message.guild.name + '][#' + message.channel.name + '][DELMSG] ' + message.author.username +
            '#' + message.author.discriminator + ': ' + formatConsoleMessage(message));

        var log = message.guild.channels.find('name', CHANNEL);
        if (log != null)
            log.sendMessage('[메세지 지워짐] ' +  message.author + ': ' + message.cleanContent );

    }

});

bot.on('message', function(message) {
    if(message.author.id != bot.user.id) {
        if (message.channel.type == 'text')
            console.log('[' + message.guild.name + '][#' + message.channel.name + '][MSG] ' + message.author.username +
                '#' + message.author.discriminator + ': ' + formatConsoleMessage(message));
        else if (message.channel.type == 'dm')
            message.channel.sendMessage(' 죄송합니다. 직접 메시지에 응답 할 수 없습니다. 봇을 초대해보십시오 ' +
                'https://discordapp.com/api/oauth2/authorize?client_id=649584572803055631&permissions=8&scope=bot');
        else if (message.channel.type == 'group')
            message.channel.sendMessage(' 메시지를 기록 할 수 없습니다. 서버로 봇을 초대하십시오! \ n' +
                'https://discordapp.com/api/oauth2/authorize?client_id=649584572803055631&permissions=8&scope=bot');
    }
});



bot.on('messageUpdate', function(oldMessage, newMessage) {

    if (newMessage.channel.type == 'text' && newMessage.cleanContent != oldMessage.cleanContent) {

        console.log('[' + newMessage.guild.name + '][#' + newMessage.channel.name + '][UPDMSG] ' +
            newMessage.author.username + '#' + newMessage.author.discriminator + ':\n\tOLDMSG: ' +
            formatConsoleMessage(oldMessage) + '\n\tNEWMSG: ' + formatConsoleMessage(newMessage));

        var log = newMessage.guild.channels.find('name', CHANNEL);
        if (log != null)
            log.sendMessage('[메세지 수정됨] ' + newMessage.author + ':\n수정전 메세지: ' + oldMessage.cleanContent);
    }

});

bot.on('guildBanAdd', function(guild, user) {

    console.log('[' + guild.name + '][BAN] ' + user.username + '#' + user.discriminator);


    var log = guild.channels.find('name', CHANNEL);
    if (log != null)
        log.sendMessage('[사용자가 추방됨] ' + user );

});

bot.on('guildBanRemove', function(guild, user) {

    console.log('[' + guild.name + '][UNBAN] ' + user.username + '#' + user.discriminator);

    var log = guild.channels.find('name', CHANNEL);
    if (log != null)
        log.sendMessage('[사용자의 추방이 취화됨]' + user);

});

bot.on('guildMemberAdd', function(guild, user) {

    console.log('[' + guild.name + '][JOIN] ' + user + '#' + user.discriminator);

    var log = guild.channels.find('name', CHANNEL);
    if (log != null) {
        log.sendMessage('[사용자가 서버에 들어옴] ' + user );
    }

});

bot.on('guildMemberRemove', function(guild, user) {


    console.log('[' + guild.name + '][LEAVE] ' + user.username + '#' + user.discriminator);

    var log = guild.channels.find('name', CHANNEL);
    if (log != null)
        log.sendMessage('[사용자가 나감] ' + user );

});


bot.on('guildMemberUpdate', function(guild, oldMember, newMember) {


    var Changes = {
        unknown: 0,
        addedRole: 1,
        removedRole: 2,
        username: 3,
        nickname: 4,
        avatar: 5
    };
    var change = Changes.unknown;


    var removedRole = '';
    oldMember.roles.every(function(value) {
        if(newMember.roles.find('id', value.id) == null) {
            change = Changes.removedRole;
            removedRole = value.name;
        }
    });


    var addedRole = '';
    newMember.roles.every(function(value) {
        if(oldMember.roles.find('id', value.id) == null) {
            change = Changes.addedRole;
            addedRole = value.name;
        }
    });


    if(newMember.user.username != oldMember.user.username)
        change = Changes.username;


    if(newMember.nickname != oldMember.nickname)
        change = Changes.nickname;


    if(newMember.user.avatarURL != oldMember.user.avatarURL)
        change = Changes.avatar;


    switch(change) {
        case Changes.unknown:
            console.log('[' + guild.name + '][UPDUSR] ' + newMember.user.username + '#' + newMember.user.discriminator);
            break;
        case Changes.addedRole:
            console.log('[' + guild.name + '][ADDROLE] ' + newMember.user.username +'#' +  newMember.user.discriminator +
                ': ' + addedRole);
            break;
        case Changes.removedRole:
            console.log('[' + guild.name + '][REMROLE] ' + newMember.user.username + '#' + newMember.user.discriminator +
                ': ' + removedRole);
            break;
        case Changes.username:
            console.log('[' + guild.name + '][UPDUSRNM] ' + oldMember.user.username + '#' + oldMember.user.discriminator +
                ' is now ' + newMember.user.username + '#' + newMember.user.discriminator);
            break;
        case Changes.nickname:
            console.log('[' + guild.name + '][UPDUSRNK] ' + newMember.user.username + '#' + newMember.user.discriminator +
                (oldMember.nickname != null ? ' (' + oldMember.nickname + ')' : '') +
                (newMember.nickname != null ? ' is now ' + newMember.nickname : ' no longer has a nickname.'));
            break;
        case Changes.avatar:
            console.log('[' + guild.name + '][UPDAVT] ' + newMember.user.username + '#' + newMember.user.discriminator);
            break;
    }

    var log = guild.channels.find('name', CHANNEL);
    if (log != null) {
        switch(change) {
            case Changes.unknown:
                log.sendMessage('[유저 업데이트] ' + newMember );
                break;
            case Changes.addedRole:
                log.sendMessage('[유저에게 역할 추가됨] ' + newMember + ': ' + addedRole );
                break;
            case Changes.removedRole:
                log.sendMessage('[유저의 역할 삭제됨] ' + newMember + ': ' + removedRole);
                break;
            case Changes.avatar:
                log.sendMessage('[유저의 아바타가 변경됨] ' + newMember );
                break;
        }
    }

});

acces_token = os.environ["BOT_TOKEN"]
bot.login(TOKEN); 

function formatConsoleMessage(message) {
    return message.cleanContent.replace(new RegExp('\n', 'g'), '\n\t');
}
