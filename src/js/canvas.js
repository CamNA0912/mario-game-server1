import platform from '../img/platform.png'
import hills from '../img/hills.png'
import background from '../img/background.png'
import platformSmallTall from '../img/platformSmallTall.png'

import spriteRunLeft from '../img/spriteRunLeft.png'
import spriteRunRight from '../img/spriteRunRight.png'
import spriteStandLeft from '../img/spriteStandLeft.png'
import spriteStandRight from '../img/spriteStandRight.png'


console.log(platform)
const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 0.5
class Player {
    constructor(){
        this.speed = 10
        this.position = {
            x: 100,
            y: 100
        }

        this.velocity = {
            x: 0,
            y: 1
        }

        this.width = 66
        this.height = 150

        this.image = createImage(spriteStandRight)
        this.frames = 0
        this.sprites = {
            stand: {
                right: createImage(spriteStandRight), 
                cropWidth: 177, 
                width: 66
            },
            run: {
                right: createImage(spriteRunRight), 
                cropWidth: 340, 
                width: 127.875
            }
        }

        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = 177
    }

    draw() {
        c.drawImage(
            this.currentSprite, 
            this.currentCropWidth * this.frames, 
            0,
            this.currentCropWidth, 
            400,
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height)
    }

    update() {
        this.frames++
        if (this.frames > 28) this.frames = 0
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.position.y + this.height + this.velocity.y <= canvas.height)
        this.velocity.y += gravity
    }
}

class Platform {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        }

        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, 
            this.position.x, 
            this.position.y)
    }
}

class GenericObject {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        }

        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

function createImage(imageSrc) {
    const image = new Image()
    image.src = imageSrc
    return image
}

let platformImage = createImage(platform)
let platformSmallTallImage = createImage(platformSmallTall)

let player = new Player()
let platforms = []
let genericObject = []

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let scroll0ffset = 0

function init() {

platformImage = createImage(platform)

player = new Player()
platforms = [
    new Platform({ 
        x: platformImage.width * 4 + 300 - 2 + platformImage.width - 
        platformSmallTallImage.width, 
        y: 270, 
        image: createImage(platformSmallTall) }
                    ),
    new Platform({
    x: -1,
    y: 470,
    image: platformImage
    }), 
    new Platform({ 
      x: platformImage.width - 3, 
      y: 470, 
      image: platformImage }
    ),
    new Platform({ 
        x: platformImage.width * 2 + 100, 
        y: 470, 
        image: platformImage }
        ),
    new Platform({ 
    x: platformImage.width * 3 + 300, 
    y: 470, 
    image: platformImage }
    ),
    new Platform({ 
    x: platformImage.width * 4 + 300 - 2, 
    y: 470, 
    image: platformImage 
    }),
    new Platform({ 
        x: platformImage.width * 5 + 600 - 2, 
        y: 470, 
        image: platformImage 
        })
    
]
genericObject = [
    new GenericObject ({
        x: -1,
        y: -1,
        image: createImage(background)
  }),
  new GenericObject ({
    x: -1,
    y: -1,
    image: createImage(hills)
})
]

scroll0ffset = 0

}

    function animate() {
        requestAnimationFrame(animate)
        c.fillStyle = 'black'
        c.fillRect(0, 0, canvas.width, canvas.height)
       
        genericObject.forEach(genericObject => {
            genericObject.draw()
        })

        platforms.forEach((platform) => {
            platform.draw()
        })
        player.update()
        

        if (keys.right.pressed && player.position.x < 400) {
            player.velocity.x = player.speed
        } else if ((keys.left.pressed && player.position.x > 100) || 
            keys.left.pressed && scroll0ffset === 0 && 
            player.position.x > 0) {
            player.velocity.x = -player.speed
        } else { 
            player.velocity.x = 0

            if(keys.right.pressed) {
                scroll0ffset += player.speed
                platforms.forEach(platform => {
                    platform.position.x -= player.speed;
                })
                genericObject.forEach(genericObject => {
                    genericObject.position.x -= player.speed * .66
                })
            } else if (keys.left. pressed && scroll0ffset > 0) {
                scroll0ffset -= player.speed

                platforms.forEach(platform => {
                    platform.position.x += player.speed;
                })

                genericObject.forEach(genericObject => {
                    genericObject.position.x += player.speed * .66
                })
            }
        }

        console.log(scroll0ffset)
        // platform collision detection
        platforms.forEach(platform => {
        if (
            player.position.y + player.height <= platform.position.y 

            && player.position.y + player.height + player.velocity.y 

            >= platform.position.y && player.position.x + player.width 

            >= platform.position.x && player.position.x 

            <= platform.position.x + platform.width
            ) {
            player.velocity.y = 0
        }
        })
 
        //win condition
        if(scroll0ffset > platformImage.width * 5 + 300 - 2) {
            console.log('You win')
        }

        //lose condition
        if (player.position.y > canvas.height) {
            init()
        }
    
    }

    init()
    animate()

    addEventListener('keydown', ({ keyCode }) => {
        //console.log( keyCode )
        switch (keyCode){
            case 65:
                console.log('left')
                keys.left.pressed = true
                break
            case 83:
                console.log('down')
                break
            case 68:
                console.log('right')
                keys.right.pressed = true
                player.currentSprite = player.sprites.run.right
                player.currentCropWidth = player.sprites.run.cropWidth
                player.width = player.sprites.run.width
                break
            case 87:
                console.log('up')
                player.velocity.y -= 15
                break
        }
        
        console.log(keys.right.pressed)
    })

    

    addEventListener('keyup', ({ keyCode }) => {
        //console.log( keyCode )
        switch (keyCode){
            case 65:
                console.log('left')
                keys.left.pressed = false
                break
            case 83:
                console.log('down')
                break
            case 68:
                console.log('right')
                keys.right.pressed = false
                break
            case 87:
                console.log('up')
                break
        }
    })
    