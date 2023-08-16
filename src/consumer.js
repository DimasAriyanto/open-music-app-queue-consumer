require('dotenv').config();
const amqp = require('amqplib');
const PlaylistsService = require('./PlaylistsService');
const MailSender = require('./MailSender');
const Listener = require('./listener');

const init = async() => {
    const playlistsService = new PlaylistsService();
    const mailSander = new MailSender();
    const listener = new Listener(playlistsService, mailSander);

    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue('export:notes', {
        durable: true,
    });

    channel.consume('export:playlists', listener.listen, { noAck: true });
};

init();
