# reddit-bot-finder
Quick and dirty chrome extension to point out likely bots/trolls/shills/morons.

Political subreddits are full of bots and trolls and idiots. The relative anonymity of reddit is useful for this, but since I usually manually look through someone's post history, I thought it might be nicer to automate it.

## How to install

1. Download this.
2. Unzip it.
3. Go into your chrome Extensions tab here chrome://extensions/
2. Tick "Developer mode" at the top right
3. Click "Load unpacked extension".
4. Select the unzipped directory.

Now when you go to comments pages in reddit in Chrome, it will tag likely bots.

## What makes a bot?

I just see if they mostly only post in political subreddits ('politics', 'ukpolitics', 'unitedkingdom') and if their score there is generally low.
I'd like to make a fancier algorithm, but I did this in about an hour at 11pm on a Monday.

Yes it probably just points out people that don't follow the reddit groupthink. Yes that could be bad. But we're talking about politics here, it's basically the science of groupthink. I'm just trying to automate my prejudices.
