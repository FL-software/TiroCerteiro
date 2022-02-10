const canvas = document.querySelector('canvas')
const contexto = canvas.getContext('2d')
const sprites = new Image()

sprites.src = 'img/sprites.png'

const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,

    desenha() {
        contexto.fillStyle = '#70c5ce'

        contexto.fillRect(0, 0, canvas.width, canvas.height)

        contexto.drawImage(
            sprites, //origem das imagens
            this.spriteX, this.spriteY, //inicio do recorte na sprite
            this.largura, this.altura, //tamanho do recorte na sprite
            this.x, this.y, //posição a ser desenhada
            this.largura, this.altura //tamanho desenhado do sprite
        )

        contexto.drawImage(
            sprites, //origem das imagens
            this.spriteX, this.spriteY, //inicio do recorte na sprite
            this.largura, this.altura, //tamanho do recorte na sprite
            (this.x + this.largura), this.y, //posição a ser desenhada
            this.largura, this.altura //tamanho desenhado do sprite
        )
    }
}

const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,

    desenha() {
        contexto.drawImage(
            sprites, //origem das imagens
            this.spriteX, this.spriteY, //inicio do recorte na sprite
            this.largura, this.altura, //tamanho do recorte na sprite
            this.x, this.y, //posição a ser desenhada
            this.largura, this.altura //tamanho desenhado do sprite
        )
        
        contexto.drawImage(
            sprites, //origem das imagens
            this.spriteX, this.spriteY, //inicio do recorte na sprite
            this.largura, this.altura, //tamanho do recorte na sprite
            (this.x + this.largura), this.y, //posição a ser desenhada
            this.largura, this.altura //tamanho desenhado do sprite
        )
    }
}

const personagem = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    velocidade: 0,
    gravidade: 0.25,

    desenha() {
        contexto.drawImage(
            sprites, //origem das imagens
            this.spriteX, this.spriteY, //inicio do recorte na sprite
            this.largura, this.altura, //tamanho do recorte na sprite
            this.x, this.y, //posição a ser desenhada
            this.largura, this.altura //tamanho desenhado do sprite
        )
    },

    atualiza() {
        this.velocidade += this.gravidade
        console.log(this.velocidade)
        this.y += this.velocidade
    }
}

function jogo() {
    planoDeFundo.desenha()
    chao.desenha()
    personagem.atualiza()
    personagem.desenha()

    requestAnimationFrame(jogo)
}

jogo()