// Geekon 2019

'use strict'

const offerTitle = document.querySelector('#offerTitle')
const headerImg = document.querySelector('#headerImg')
const offerText = document.querySelector('#offerText')
const offerBtn = document.querySelector('#offerBtn')
const imageContainer = document.querySelector('.image-container')
const offerContainer = document.querySelector('.offer-container')

chrome.storage.sync.get('offer', ({ offer }) => {
    if (offer) {
        const [currentOffer,] = offer.offers

        offerTitle.innerText = offer.offers.length === 1
            ? `There is 1 available offer`
            : `There are ${offer.offers.length} available offers`

        headerImg.src = offer.image
        imageContainer.style.display = 'block'

        offerText.innerText = currentOffer.text
        offerBtn.href = currentOffer.link
        offerContainer.style.display = 'block'
    } else {
        offerTitle.innerText = `We're sorry, we don't have any offers for this website`
        imageContainer.style.display = 'none'
        offerContainer.style.display = 'none'
    }
})
