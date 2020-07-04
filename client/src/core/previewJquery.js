import $ from 'jquery'

// version 1 : copy target and append it to body
// when we only need copied target
// export const previewInit = () => {
//     var timer;
//     var x = 0
//     $('.card-box').mouseover(function (e) {
//         if (x === 0) {
//             timer = setTimeout(function () {
//                 console.log($(window).width())
//                 const windowWidth = $(window).width()
//                 $('.copied-preview').remove()
//                 var cardbox = e.target
//                 if (!e.target.classList.contains('card-box')) {
//                     cardbox = e.target.closest('.card-box')
//                 }
//                 // target = card-preview div element
//                 var target = cardbox.querySelector('.card-preview')
//                 const styleFromTarget = getComputedStyle(target)
//                 const destination = document.querySelector('#root');

//                 var bodyRect = document.body.getBoundingClientRect(),
//                     elemRect = cardbox.getBoundingClientRect(),
//                     topOffset = elemRect.top - bodyRect.top
//                 var dataPlacementValue = elemRect.left < windowWidth / 2 ? 'right' : 'left'
//                 // the number 300 is hard coded is because % width does not work in this case.
//                 var widthOfTarget = parseInt(styleFromTarget.width.slice(0, -2))

//                 var xaxis = elemRect.left < windowWidth / 2 ? elemRect.right : elemRect.left - widthOfTarget


//                 // here target is original node with full ability and handleClick in copied one
//                 // does not work becuase copied one is just copied node with only style not with function.  
//                 var copiedOne = target.cloneNode(true)
//                 copiedOne.classList.add('copied-preview')
//                 copiedOne.style.display = 'block'
//                 copiedOne.style.top = `${topOffset - 20}px`
//                 copiedOne.style.left = `${xaxis}px`
//                 copiedOne.style.transition = '0.2s'
//                 copiedOne.setAttribute('data-placement', dataPlacementValue)

//                 copiedOne.addEventListener('mouseover', () => {
//                     $('.copied-preview').show()
//                 })

//                 copiedOne.addEventListener('mouseleave', (e) => {
//                     var criteria = elemRect.right
//                     console.log(elemRect.right > e.pageX , elemRect.right , e.pageX)

//                     if (elemRect.right > e.pageX) {
//                         // copiedOne.style.display = 'block'
//                     } else{
//                         $('.copied-preview').hide()
//                     }
//                     // else if (elemRect.left < e.pageX && criteria > 600) {
//                     //     copiedOne.style.display = 'none'
//                     // }
//                 })

//                 // because event keep happening when mouse is hovering on element
//                 if (!document.querySelector('.copied-preview')) {
//                     destination.appendChild(copiedOne)
//                 }
//             }, 500);
//             x = x + 1
//         }
//     }).mouseleave(function () {
//         x = 0

//         $('.copied-preview').hide()
//         clearTimeout(timer);
//     })
//         .click(() => {
//             $('.copied-preview').remove()
//             clearTimeout(timer)
//         })
// }


// THIS is how it works
//  we have three things here 
// 1: .card-box : box contatining all content in card, 
// 2: .card-preview: the most parent div contatining all content about card preview(target), 
// 3: copiedOne(copied target)

// step1 : wheen mouse hover on card-box, it will make copy of target and append it on dom
// step2.1 when mouse leave card-box, copy of target hide
// step2.2 when mouse enter to copied card-preview box, actually target node appended to dom
//          and copied one get attribute of display none
// step3 : when mouse leave target node, node goes back to its position in DOM.
// step3.1 : when mouse leave target node but move back to card-box, it gives copied one attribute display block.

// version 2 : append target to body : most efficient version
// export const previewInit = () => {
//     var timer;
//     var x = 0;
//     $('.quick-view-loading').mouseover(function (e) {

//     })

//     $('.card-box').mouseover(function (e) {
//         console.log("whatis x :", x)
//         if (x === 0) {
//             x = x + 1
//             console.log("right after incre")
//             timer = setTimeout(function () {

//                 console.log(document.querySelector('.moved-preview'))
//                 var cardbox = e.target
//                 if (!e.target.classList.contains('card-box')) {
//                     cardbox = e.target.closest('.card-box')
//                 }

//                 // target = card-preview div element
//                 console.log(e.target, '|', target, '|', cardbox)
//                 if (!cardbox) return false;

//                 const destination = document.querySelector('#root');
//                 var target = cardbox.querySelector('.card-preview')
//                 if (!target) return false;

//                 // get style and location of element
//                 const styleFromTarget = getComputedStyle(target)
//                 const windowWidth = $(window).width()
//                 var bodyRect = document.body.getBoundingClientRect(),
//                     elemRect = cardbox.getBoundingClientRect(),
//                     topOffset = elemRect.top - bodyRect.top
//                 // var dataPlacementValue = elemRect.left < windowWidth / 2 ? 'right' : 'left'
//                 // the number 300 is hard coded is because % width does not work in this case.
//                 var widthOfTarget = parseInt(styleFromTarget.width.slice(0, -2))
//                 var xaxis = elemRect.left < windowWidth / 2 ? elemRect.right - 30 : elemRect.left - widthOfTarget + 30


//                 // here target is original node with full ability and handleClick in copied one
//                 // does not work becuase copied one is just copied node with only style not with function.  

//                 target.classList.add('moved-preview')
//                 target.style.position = 'absolute'
//                 target.style.display = 'block'
//                 target.style.top = `${topOffset - 20}px`
//                 target.style.left = `${xaxis}px`
//                 // target.setAttribute('data-placement', dataPlacementValue)
//                 destination.appendChild(target)

//                 target.addEventListener('mouseover', () => {
//                     $('.moved-preview').show()
//                 })

//                 // target is copied one and moved one
//                 target.addEventListener('mouseleave', (e) => {

//                     var criteria = elemRect.right
//                     // if (elemRect.right > e.pageX) {

//                     // } else {
//                     //     target.classList.remove('moved-preview')
//                     //     target.style.display = 'none'
//                     //     cardbox.appendChild(target)
//                     // }

//                     var leftOrRight = elemRect.left < windowWidth / 2 ? "right" : "left"
//                     if (leftOrRight === "right" && elemRect.right > e.pageX) {

//                     } else if (leftOrRight === "left" && elemRect.left < e.pageX) {

//                     } else {
//                         target.classList.remove('moved-preview')
//                         target.style.display = 'none'
//                         cardbox.appendChild(target)
//                     }

//                     // if (elemRect.left < e.pageX && criteria > 600) {

//                     // } else{
//                     //     target.classList.remove('moved-preview')
//                     //     target.style.display = 'none'
//                     //     cardbox.appendChild(target)
//                     // }
//                 })

//                 // because event keep happening when mouse is hovering on element
//                 // if (!document.querySelector('.copied-preview')) {
//                 //     destination.appendChild(copiedOne)
//                 // }
//                 // x = x + 1
//             }, 1000);
//         }
//         x = x + 1

//     }).mouseleave(function (e) {
//         clearTimeout(timer);
//         x = 0
//         var cardbox = e.target.closest('.card-box')
//         var target = document.querySelector('.moved-preview')

//         console.log("what is cardbox : ", cardbox)
//         console.log("what is target : ", target)
//         if (!target) {
//             return false
//         }

//         const windowWidth = $(window).width()
//         var elemRect = cardbox.getBoundingClientRect();
//         // var xaxis = elemRect.left < windowWidth / 2 ? elemRect.right : elemRect.left - widthOfTarget

//         var leftOrRight = elemRect.left < windowWidth / 2 ? "right" : "left"
//         // var dataPlacementValue = elemRect.left < windowWidth / 2 ? 'right' : 'left'
//         console.log(elemRect.right, e.pageX)
//         if (leftOrRight === "right" && elemRect.right < e.pageX + 40) {
//             console.log("mouse moved to right")

//         } else if (leftOrRight === "left" && elemRect.left + 40 > e.pageX) {

//         }
//         else {
//             console.log("nope")
//             target.classList.remove('moved-preview')
//             target.style.display = 'none'
//             cardbox.appendChild(target)
//         }
//         console.log("mouse left?")
//     })
//         .click(() => {
//             $('.copied-preview').remove()
//             clearTimeout(timer)
//         })
// }

// version 2 : mouseleave => target go back to original dom
// const addBackgroundWrapper = () => {
//     const destination = document.querySelector('#root');
//     const replicate = document.querySelector('.background-wrapper-for-quick-view');
//     if (!replicate) {
//         var target = document.createElement("div");
//         target.style.position = 'absolute'
//         target.classList.add('background-wrapper-for-quick-view')
//         target.style.display = 'block'
//         target.style.width = '100%'
//         target.style.height = '100%'
//         target.style.backgroundColor = 'rgba(0,0,0,0.8)'
//         target.style.top = `0`
//         target.style.left = `0`
//         target.style.zIndex = `9990`
//         destination.appendChild(target)
//     }
// }

// const removeBackgroundWrapper = () => {
//     var target = document.querySelector('.background-wrapper-for-quick-view')
//     console.log("what is target : ", target)
//     if (!target) {
//         return false
//     }
//     target.parentNode.removeChild(target)
// }

// // testing version
// export const previewInit = () => {
//     var timer;
//     var x = 0;

//     $('.open-quick-view-btn').mouseover(function (e) {
//         console.log("sonn will set timer and x is : ", x)

//         // without x counter : it will append target multiple times becuase mouseover effect happens so quick
//         if (x === 0) {
//             x = x + 1
//             // console.log("sonn will set timer and x is : ", x)
//             timer = setTimeout(function () {
//                 console.log("mouse over and timer set")
//                 var cardbox = e.target
//                 if (!e.target.classList.contains('card-box')) {
//                     cardbox = e.target.closest('.card-box')
//                 }

//                 // target = card-preview div element
//                 if (!cardbox) return false;

//                 const destination = document.querySelector('#root');
//                 var target = cardbox.querySelector('.card-preview')
//                 if (!target) return false;

//                 // get style and location of element
//                 const styleFromTarget = getComputedStyle(target)
//                 const windowWidth = $(window).width()
//                 var bodyRect = document.body.getBoundingClientRect(),
//                     elemRect = cardbox.getBoundingClientRect(),
//                     topOffset = elemRect.top - bodyRect.top
//                 var widthOfTarget = parseInt(styleFromTarget.width.slice(0, -2))
//                 var xaxis = elemRect.left < windowWidth / 2 ? elemRect.right - 90 : elemRect.left - widthOfTarget + 30

//                 // here target is original node with full ability and handleClick in copied one
//                 // does not work becuase copied one is just copied node with only style not with function.  

//                 target.classList.add('moved-preview')
//                 target.style.position = 'absolute'
//                 target.style.display = 'block'
//                 target.style.top = `${topOffset - 20}px`
//                 target.style.left = `${xaxis}px`
//                 target.style.zIndex = `9991`

//                 // push trailer to trailer-location div
//                 var trailerLocation = target.querySelector('.trailer-location')
//                 if (!trailerLocation.querySelector('.youtube-video')) {
//                     trailerLocation.innerHTML=""
//                     var src = trailerLocation.title
//                     var iframe = document.createRange().createContextualFragment(`<iframe className="youtube-video" src=${src} frameBorder="0" allowfullscreen="allowfullscreen">
//                     </iframe>`);
//                     trailerLocation.appendChild(iframe)
//                 }


//                 // target.setAttribute('data-placement', dataPlacementValue)
//                 destination.appendChild(target)

//                 target.addEventListener('mouseover', () => {
//                     addBackgroundWrapper()
//                     // $('.moved-preview').show()
//                 })

//                 // target is copied one and moved one
//                 target.addEventListener('mouseleave', (e) => {
//                     target.classList.remove('moved-preview')
//                     target.style.display = 'none'
//                     cardbox.appendChild(target)
//                     removeBackgroundWrapper()
//                 })
//             }, 1000);
//         }
//         x = x + 1

//     }).mouseleave(function (e) {
//         clearTimeout(timer);
//         x = 0
//         var cardbox = e.target.closest('.card-box')
//         var target = document.querySelector('.moved-preview')

//         if (!target) {
//             return false
//         }

//         const windowWidth = $(window).width()
//         var elemRect = cardbox.getBoundingClientRect();

//         var leftOrRight = elemRect.left < windowWidth / 2 ? "right" : "left"

//         var offset = elemRect.right - e.pageX

//         if (leftOrRight === "right" && elemRect.right <= e.pageX + 100) {

//         } else if (leftOrRight === "left" && elemRect.left + 40 > e.pageX) {

//         }
//         else {
//             target.classList.remove('moved-preview')
//             target.style.display = 'none'
//             cardbox.appendChild(target)
//         }
//     })

//     $('.btn-in-quick-view').click(() => {
//         $('.moved-preview').remove()
//         $('.background-wrapper-for-quick-view').remove()
//     })
// }

// VERSION2 : close button clicked => target go back to original dom
const addBackgroundWrapper = () => {
    const destination = document.querySelector('#root');
    const replicate = document.querySelector('.background-wrapper-for-quick-view');
    if (!replicate) {
        var target = document.createElement("div");
        target.style.position = 'absolute'
        target.classList.add('background-wrapper-for-quick-view')
        target.style.display = 'block'
        target.style.width = '100%'
        target.style.height = '100%'
        target.style.backgroundColor = 'rgba(0,0,0,0.8)'
        target.style.top = `0`
        target.style.left = `0`
        target.style.zIndex = `9990`
        destination.appendChild(target)
    }
}

const removeBackgroundWrapper = () => {
    var target = document.querySelector('.background-wrapper-for-quick-view')
    console.log("what is target : ", target)
    if (!target) {
        return false
    }
    target.parentNode.removeChild(target)
}

// testing version
export const previewInit = () => {
    var timer;
    var x = 0;

    $('.open-quick-view-btn').mouseover(function (e) {
        console.log("sonn will set timer and x is : ", x)

        // without x counter : it will append target multiple times becuase mouseover effect happens so quick
        if (x === 0) {
            x = x + 1
            // console.log("sonn will set timer and x is : ", x)
            timer = setTimeout(function () {
                console.log("mouse over and timer set")
                var cardbox = e.target
                if (!e.target.classList.contains('card-box')) {
                    cardbox = e.target.closest('.card-box')
                }

                // target = card-preview div element
                if (!cardbox) return false;

                const destination = document.querySelector('#root');
                var target = cardbox.querySelector('.card-preview')
                if (!target) return false;

                // get style and location of element
                const styleFromTarget = getComputedStyle(target)
                const windowWidth = $(window).width()
                var bodyRect = document.body.getBoundingClientRect(),
                    elemRect = cardbox.getBoundingClientRect(),
                    topOffset = elemRect.top - bodyRect.top
                var widthOfTarget = parseInt(styleFromTarget.width.slice(0, -2))
                var xaxis = elemRect.left < windowWidth / 2 ? elemRect.right - 90 : elemRect.left - widthOfTarget + 30

                // here target is original node with full ability and handleClick in copied one
                // does not work becuase copied one is just copied node with only style not with function.  

                target.classList.add('moved-preview')
                // target.style.position = 'absolute'
                target.style.display = 'block'
                // target.style.top = `${topOffset - 20}px`
                // target.style.left = `${xaxis}px`
                // target.style.zIndex = `9991`

                // push trailer to trailer-location div
                var trailerLocation = target.querySelector('.trailer-location')
                if (!trailerLocation.querySelector('.youtube-video')) {
                    trailerLocation.innerHTML=""
                    var src = trailerLocation.title
                    var iframe = document.createRange().createContextualFragment(`<iframe  className="youtube-video" src="${src}&autoplay=1" frameBorder="0" allowfullscreen="allowfullscreen">
                    </iframe>`);
                    trailerLocation.appendChild(iframe)
                }

                // target.setAttribute('data-placement', dataPlacementValue)
                destination.appendChild(target)
                addBackgroundWrapper()

                // when close-btn is clicked => it close backgroundwrapper and quick view box
                target.querySelector(".close-btn").addEventListener("click",()=>{
                    target.classList.remove('moved-preview')
                    target.style.display = 'none'
                    cardbox.appendChild(target)
                    removeBackgroundWrapper()

                    var iframes = document.querySelectorAll('iframe');
                    Array.prototype.forEach.call(iframes, iframe => {
                        iframe.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
                    });
                
                })
            }, 1000);
        }
        x = x + 1

    }).mouseleave(function (e) {
        clearTimeout(timer);
        x = 0
    })

    $('.btn-in-quick-view').click(() => {
        $('.moved-preview').remove()
        $('.background-wrapper-for-quick-view').remove()
    })

  
}

