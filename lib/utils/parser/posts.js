'use strict';

var
    Promise = require('bluebird');

exports = module.exports = async (_response) => {

    var posts = [];

    await Promise.all(_response.data.hashtag.edge_hashtag_to_media.edges.map((edge) => {
        if (!edge.node.is_video) {
            posts.push({
                id: edge.node.id,
                caption: edge.node.edge_media_to_caption.edges.length == 0 ? null : edge.node.edge_media_to_caption.edges[0].node.text,
                shortcode: edge.node.shortcode,
                timestamp: edge.node.taken_at_timestamp,
                image: edge.node.display_url,
                likes: edge.node.edge_liked_by.count,
                owner: edge.node.owner.id
            });
        }
    }));

    return posts;

};