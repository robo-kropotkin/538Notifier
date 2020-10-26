## Introduction

Sick of refreshing the FiveThirtyEight forcast page every 10 minutes hoping for that 87 to turn to 88? Introducing 538Notifier!

## Example

This extension checks the FiveThirtyEight forcast page and sends you a desktop notification with the current odds when there's an update.
The notification should look like this:

![Example](/Example.png)

## How does it work?

1. The extension requests current prediction data through FiveThirtyEight's API.
2. The extension compares the update time data with the one it remembers, if such exists.
3. If the times are different, it remembers the current update time and send you a notification that the prediction was updated.

#### Found a bug? Report it in the issues tab.
