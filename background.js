// Geekon 2019

'use strict'

const baseUrl = 'http://browserplugin.geekon.us-west-2.aws.groupondev.com'
const oneHourMs = 3600000
let websitesOffers = []

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ offer: false })
})

chrome.tabs.onUpdated.addListener(handleTabChange)

chrome.tabs.onActivated.addListener(({ tabId }) => {
    chrome.tabs.get(tabId, ({ status, url }) => {
        handleTabChange(tabId, { status }, { url })
    })
})

// Fetching websites array
updateWebsitesOffers()

// Polling for updating websites array
poll(oneHourMs)

function changeBadge(text) {
    chrome.browserAction.setBadgeText({ text })
    chrome.browserAction.setBadgeBackgroundColor({ color: '#4688F1' })
}

function updateWebsitesOffers() {
    request('GET', '/sites')
        .then(({ target: { response } }) => {
            websitesOffers = JSON.parse(response).sites
            console.log({ websitesOffers })
        })
        .catch(console.error)
}

function poll(pollTime = 5000) {
    setInterval(async () => {
        updateWebsitesOffers()
    }, pollTime)
}

function request(method, url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open(method, `${baseUrl}${url}`)
        xhr.onload = resolve
        xhr.onerror = reject
        xhr.send()
    })
}

function handleTabChange(tabId, { status }, { url }) {
    if (status === 'complete' && websitesOffers.some(website => url.includes(website))) {
        chrome.browserAction.setIcon({ path: 'images/groupon_icon_48.png' })
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

            const website = websitesOffers.find(website => url.includes(website))

            request('GET', `/offers/${website}`)
                .then(({ target: { response } }) => {
                    const offer = JSON.parse(response).offer
                    console.log({ offer })
                    chrome.storage.sync.set({ offer }, () => {
                        changeBadge(String(offer.offers.length))
                    })
                })
                .catch(console.error)
        })
    } else {
        chrome.browserAction.setIcon({ path: 'images/groupon_icon_grey_48.png' })
        changeBadge('')
        chrome.storage.sync.set({ offer: false })
    }
}


