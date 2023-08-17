const { Pool } = require("pg");

class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }

    async getPlaylists(userId) {
        const query = {
            text: `SELECT playlists.id AS playlist_id, playlists.name AS playlist_name,
                songs.id AS song_id, songs.title AS song_title, songs.performer AS song_performer
                FROM playlists
                JOIN playlistsongs ON playlistsongs.playlist_id = playlists.id
                JOIN songs ON playlistsongs.song_id = songs.id
                WHERE playlists.owner = $1`,
            values: [userId],
        };
        
        const result = await this._pool.query(query);
        
        const playlist = {
            id: result.rows[0].playlist_id,
            name: result.rows[0].playlist_name,
            songs: result.rows
              .filter((row) => row.song_id !== null)
              .map((row) => ({
                id: row.song_id,
                title: row.song_title,
                performer: row.song_performer,
              })),
          };
      
          return playlist;
    }
}

module.exports = PlaylistsService;
