chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			var POL_SUBS = new Set(['politics', 'ukpolitics', 'unitedkingdom']);

			var authorTags = document.querySelectorAll('.author');
			var names = Array.from(new Set(Array.from(authorTags)));
			var promises = names.map(({innerText}) =>
				fetch(`/user/${innerText}/overview.json`)
					.then(r => r.json())
					.then(processResponse)
			);

			function accumulateSubreddits(sum, {score, subreddit}) {
			    if (sum[subreddit]) {
			        sum[subreddit] += parseInt(score)
			    }  else {
			        sum[subreddit] = parseInt(score)
			    }
			    return sum;
			}

			function countPostsInSubreddits(sum, {subreddit}) {
			    if (sum[subreddit]) {
			        sum[subreddit]++
			    }  else {
			        sum[subreddit] = 1
			    }
			    return sum;
			}

			function findAuthorTags(name) {
			    return Array.from(authorTags).filter(({innerText}) => innerText === name);
			}

			function objToSortedTuples(obj) {
			    var makeTuple = key => [key, obj[key]];
			    return Object.keys(obj)
			        .reduce((sum, key) => sum.concat([makeTuple(key)]), [])
			        .sort((a, b) => a[1] < b[1] ? 1 : -1);
			}


			function botLikelihood(mostPosted, scores) {
			    var weight = 0;
			    for (var elem of mostPosted) {
			        var name = elem[0];
			        if (POL_SUBS.has(name)) {
			            var score = scores[name];
			            weight -= score;
			        }
			    }
			    return weight > 0;
			}

			function appendTag(elem) {
			    var div = document.createElement('div');
			    div.innerText = 'LIKELY BOT';
			    div.style['background-color'] = 'red'
			    div.style['color'] = 'white'
			    elem.appendChild(div);
			}

			function processResponse(response){
				try {
					if (!response) {
						return;
					}
					var {data} = response;
					if (!data) {
						return;
					}
					var {children} = data;
					var name = children[0].data.author;

					var dataArr = children.map(i => i.data);
					var subbredditCounts = dataArr.reduce(countPostsInSubreddits, {});
					var subbredditScores = dataArr.reduce(accumulateSubreddits, {});

					var sorted = objToSortedTuples(subbredditCounts);
					var mostlyPostsIn = sorted.slice(0, 4);
					var likelyBot = botLikelihood(mostlyPostsIn, subbredditScores);

					if (!likelyBot) {
						return;
					}

					findAuthorTags(name).forEach(appendTag);
				} catch (e) {
					console.error(e);
				}
			}
		}
	}, 10);
});
