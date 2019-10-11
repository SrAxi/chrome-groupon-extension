// Geekon 2019

'use strict'

const imageContainer = document.querySelector('.image-container')
const headerImg = document.querySelector('#headerImg')
const offerTitle = document.querySelector('#offerTitle')

chrome.storage.sync.get('offer', ({ offer }) => {
    if (offer) {
        const { offers, image } = offer

        updateTitle(offers)
        showHeader(image)
        createOffers(offers)
    } else {
        updateTitle()
        hideHeader()
        removeOffers()
    }
})

function showHeader(image) {
    headerImg.src = image
    imageContainer.style.display = 'block'
}

function hideHeader() {
    imageContainer.style.display = 'none'
}

function updateTitle(offers = []) {
    offerTitle.innerText = !offers.length
        ? `We're sorry, we don't have any offers for this website`
        : offers.length === 1
            ? `There is 1 available offer`
            : `There are ${offers.length} available offers`
}

function createOffers(offers = []) {
    const offersContainer = document.querySelector('#offers')

    offers.forEach(({ text, link }) => {
        const offerContainer = document.createElement('div')
        offerContainer.className = 'ui segment center aligned offer-container'

        const offerText = document.createElement('p')
        offerText.innerText = text

        const offerBtn = document.createElement('a')
        offerBtn.className = 'ui green button'
        offerBtn.target = '_blank'
        offerBtn.innerText = 'Go to offer!'
        offerBtn.href = link

        offerContainer.append(offerText)
        offerContainer.append(offerBtn)
        offersContainer.append(offerContainer)
    })
}

function removeOffers() {
    const containers = document.getElementsByClassName('offer-container')
    containers.forEach(c => c.parentNode.removeChild(c))
}
