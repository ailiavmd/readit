// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// Modules
const {ipcRenderer} = require('electron')
const items = require('./items')
const menu = require('./menu')

// Navigate select item with up/down keys
$(document).keydown((e) => {
    switch (e.key) {
        case 'ArrowUp':
        items.changeItem('up')
        break;
        case 'ArrowDown':
        items.changeItem('down')
        break;
    }
})

// Show modal
$('.open-modal').click(() => {
    $('#add-modal').addClass('is-active')
    $('#item-input').focus()
})
// Hide modal
$('.close-modal').click(() => {
    $('#add-modal').removeClass('is-active')
})

// Handle add-modal submission
$('#add-button').click(() => {
    // Get URL from input
    let newItemURL = $('#item-input').val()
    if (newItemURL) {
        // Disable modal UI
        $('#item-input').prop('disabled', true)
        $('#add-button').addClass('is-loading')
        $('.close-modal').attr('disabled', true)
        // Send URL to main process via IPC
        ipcRenderer.send('new-item', newItemURL)
    }
})

// Listen for new item from main
ipcRenderer.on('new-item-success', (e, item) => {
    // Add item to items array
    items.toReadItems.push(item)
    // Save to localstorage
    items.saveItems()
    // Add item to IU
    items.addItem(item)
    // Close and reset modal
    $('#add-modal').removeClass('is-active')
    $('#item-input').prop('disabled', false).val('')
    $('#add-button').removeClass('is-loading')
    $('.close-modal').attr('disabled', false)
    // If first item being added, select it
    if (items.toReadItems.length === 1) $('.read-item:first()').addClass('is-active')
})

// Simulate add click on enter
$('#item-input').keyup((e) => {
    if (e.key === 'Enter') $('#add-button').click()
})

// Filter items by title
$('#search').keyup((e) => {
    // Get current #search input value
    let filter = $(e.currentTarget).val()
    
    $('.read-item').each((i, el) => {
        $(el).text().toLowerCase().includes(filter) ? $(el).show() : $(el).hide()
    })
})

// Add items when app loads
if (items.toReadItems.length) {
    items.toReadItems.forEach(items.addItem)
    $('.read-item:first()').addClass('is-active')
}