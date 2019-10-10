// Geekon 2019

'use strict'

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ offer: false })
})

let websitesOffers = []

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && websitesOffers.some(url => tab.url.includes(url))) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.browserAction.setIcon({ path: 'images/groupon_icon_48.png' })

            // TODO: Change this mocked object with an actual Ajax call
            const offer = {
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/AVIS_logo_2012.svg/1280px-AVIS_logo_2012.svg.png',
                offers: [
                    {
                        link: 'https://www.groupon.com/coupons/events/car-rental-deals?c=7a103b69-8d6e-48f4-bb95-58feace66d76',
                        text: 'Save $10 to $25 on your next rental!'
                    }
                ]
            }
            chrome.storage.sync.set({ offer }, () => {
                changeBadge(String(offer.offers.length))
            })
        })
    } else {
        chrome.browserAction.setIcon({ path: 'images/groupon_icon_grey_48.png' })
        changeBadge('')
        chrome.storage.sync.set({ offer: false })
    }
})

function changeBadge(text) {
    chrome.browserAction.setBadgeText({ text })
    chrome.browserAction.setBadgeBackgroundColor({ color: '#4688F1' })
}

async function stall(stallTime = 2000) {
    await new Promise(resolve => setTimeout(resolve, stallTime))
}

function poll(pollTime = 5000) {
    setInterval(async () => {
        // TODO: This is mocking the API call that retrieves the website array
        console.log('polling, waiting 2 seconds')
        await stall()
        websitesOffers = Math.random() * 100 > 50 ? ["avis.com"] : ["budget.ie", "enterprise.ie"]

        console.log('Hi, I\'m polling', websitesOffers)
    }, pollTime)
}

poll()


