const Twit = require('twit');
const fs = require('fs');

require('dotenv').config();

const loadRetweets = () => {
    const file = fs.readFileSync(__dirname+'/data/retweets.json');
    return JSON.parse(file);
}

const dumpRetweets = (tweets) => {
    fs.writeFileSync(__dirname+'/data/retweets.json', JSON.stringify(tweets, null, 2));
}

const T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

const handleError = (err, data, response) => {
    console.log(err);
}

const stream = T.stream('statuses/filter', { track: '#javascript' });

stream.on('tweet', (tweet) => {
    const tweetId = tweet.id_str;
    const userName = tweet.user.screen_name;

    console.log('Retweeting: ')
    console.log(`User: ${userName}`);
    console.log(`tweet: ${tweetId}\n`);

    const retweets = loadRetweets();

    if ( !retweets.includes( tweetId ) ){
        T.post('statuses/retweet/:id', {id:tweetId}, handleError);

        retweets.push(tweetId);
        dumpRetweets(retweets);
    }
});