chrome.alarms.create("538 Updated", {when: Date.now(), periodInMinutes:1})
chrome.alarms.onAlarm.addListener(checkModel);

chrome.notifications.onClicked.addListener((id) => {
	if (id=="538 Updated")
		chrome.tabs.create({url: "https://projects.fivethirtyeight.com/2020-election-forecast/"});
});

function checkModel(alarm) {
	if (alarm.name != "538 Updated") return false;

	FiveThirtyEightRequest = new XMLHttpRequest();
	FiveThirtyEightRequest.open("GET", "https://projects.fivethirtyeight.com/2020-election-forecast/us_timeseries.json")
	FiveThirtyEightRequest.onreadystatechange = () => {
		if (FiveThirtyEightRequest.readyState == 4) {
			var newUpdated, newBiden, newTrump
			modelData = JSON.parse(FiveThirtyEightRequest.responseText)[0]

			newUpdated = new Date(modelData.updated)
			modelData.candidates.forEach((dude, index) => {
				switch (dude.candidate) {
					case "Biden":
						bidenOdds = Math.round(dude.dates[0].winprob);
						break;
					case "Trump":
						trumpOdds = Math.round(dude.dates[0].winprob);
						break;
				}
			})
			chrome.storage.local.get(["FiveThirtyEightUpdateTime"], ({FiveThirtyEightUpdateTime}) =>{
				if (!FiveThirtyEightUpdateTime) {
					chrome.storage.local.set({ "FiveThirtyEightUpdateTime": newUpdated.getTime() })
				}
				else if (FiveThirtyEightUpdateTime < newUpdated.getTime()) {
					chrome.storage.local.set({"FiveThirtyEightUpdateTime": newUpdated.getTime()})
					notify(bidenOdds, trumpOdds)
				}
			});
		}
	}
	FiveThirtyEightRequest.send();
}

function notify(bidenOdds, trumpOdds) {
	notifOptions = {
		type: "progress",
		title: "538 Model Updated",
		iconUrl: "./FOXYMALARKEY.png",
		message: "538 Just updated their prediction! Click here to check it out!\nBiden: " + bidenOdds + ", Trump: " + trumpOdds,
		progress: bidenOdds,
		silent: true
	}
	chrome.notifications.create("538 Updated", notifOptions);	chrome.notifications.clear("538 Updated");
}