const canvas = document.querySelector('canvas')
const contexto = canvas.getContext('2d')
const sprites = new Image()
sprites.src = 'img/sprites.png'

const somCaiu = new Audio()
somCaiu.src = 'audio/caiu.wav'

const somHit = new Audio()
somHit.src = 'audio/hit.wav'

const somPonto = new Audio()
somPonto.src = 'audio/ponto.wav'

const somPulo = new Audio()
somPulo.src = 'audio/pulo.wav'

let frames = 0
let globais = {}
let telaAtiva = {}
let melhor = 0

const telas = {
    inicio: {
        inicializa() {
            globais.personagem = criaPersonagem()
            globais.chao = criaChao()
            globais.canos = criaCanos()
        },
        desenha() {
            planoDeFundo.desenha()
            globais.chao.desenha()
            globais.personagem.desenha()
            telaInicio.desenha()
        },
        click() {
            mudaParaTela(telas.meio)
        },
        atualiza() {
            globais.chao.atualiza()
        }
    },
    meio: {
        inicializa() {
            globais.placar = criaPlacar()
        },
        desenha() {
            planoDeFundo.desenha() 
            globais.canos.desenha()           
            globais.chao.desenha()
            globais.personagem.desenha()
            globais.placar.desenha()
        },
        click() {
            globais.personagem.pula()
        },
        atualiza() {
            globais.canos.atualiza()
            globais.chao.atualiza()
            globais.personagem.atualiza()
            globais.placar.atualiza()
        }
    },
    fim: {
        desenha() {
            telaFim.desenha()
            medalha.desenha()
        },
        atualiza() {
        },
        click() {
            mudaParaTela(telas.inicio)
        }
    }
}

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
            sprites,
            this.spriteX, this.spriteY,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura
        )
        contexto.drawImage(
            sprites,
            this.spriteX, this.spriteY,
            this.largura, this.altura,
            (this.x + this.largura), this.y,
            this.largura, this.altura
        )
    }
}

const telaInicio = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            this.spriteX, this.spriteY,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura
        )
    }
}

const telaFim = {
    spriteX: 134,
    spriteY: 153,
    largura: 226,
    altura: 200,
    x: (canvas.width / 2) - 226 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            this.spriteX, this.spriteY,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura
        )

        contexto.font = '35px "VT323"'
        contexto.textAlign = 'right'
        contexto.fillStyle = 'green'
        contexto.fillText(`${globais.placar.pontuacao}`, canvas.width / 2 + 80, canvas.height / 2 - 92)
        contexto.fillText(`${melhor}`, canvas.width / 2 + 80, canvas.height / 2 - 52)
    }
}

const medalha = {
    spriteX: 213,
    spriteY: 370,
    largura: 48,
    altura: 62,
    x: (canvas.width / 2) - 90,
    y: 135,
    desenha() {
        //console.log('[globais.placar.pontuacao]', globais.placar.pontuacao)
        //console.log('[melhor]', melhor)

        if (globais.placar.pontuacao == melhor){
            this.spriteX = 162
        }
        else {
            this.spriteX = 213
        }

        contexto.drawImage(
            sprites,
            this.spriteX, this.spriteY,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura
        )
    }
}

function criaPlacar() {
    const placar = {
        pontuacao: 0,
        velocidade: 1,
        intervaloDeFramesMovimento: 20,
        desenha() {
            contexto.font = '35px "VT323"'
            contexto.textAlign = 'right'
            contexto.fillStyle = 'white'
            contexto.fillText(`${this.pontuacao}`, canvas.width - 10, 35)
        },
        atualiza() {
            if (frames % this.intervaloDeFramesMovimento === 0) {
                if (this.pontuacao > 0 && this.pontuacao % 10 === 0)
                {
                    somPonto.play()
                }

                this.pontuacao++

                //console.log('[melhor]', melhor)

                if (this.pontuacao >= melhor)
                {
                    melhor = this.pontuacao
                }
            }
        }
    }

    return placar
}

function criaCanos() {
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 100,
        pares: [],
        intervaloDeFramesMovimento: 10,
        desenha() {
            canos.pares.forEach(function(par) {
                par.canoCeu = {
                    x: par.x,
                    y: par.y + canos.altura
                }

                par.canoChao = {
                    x: par.x,
                    y: canos.altura + canos.espaco + par.y
                }

                contexto.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    par.canoCeu.x, par.canoCeu.y - canos.altura,
                    canos.largura, canos.altura
                )     
                contexto.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura, canos.altura,
                    par.canoChao.x, par.canoChao.y,
                    canos.largura, canos.altura
                ) 
            })            
        },
        temColisaoComPersonagem(par) {
            if (globais.personagem.x + globais.personagem.largura >= par.x){
                if (globais.personagem.y <= par.canoCeu.y) {
                    return true
                }

                if (globais.personagem.y + globais.personagem.altura >= par.canoChao.y) {
                    return true                    
                }
            }

            return false
        },
        atualiza() {
            if (frames % 100 === 0) {
                //console.log('[passou 100 frames]')
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1)
                })
            }

            canos.pares.forEach(function(par) { 
                par.x -= 2

                if (canos.temColisaoComPersonagem(par)) {
                    //console.log('[colisão com cano]')

                    somHit.play()
        
                    mudaParaTela(telas.fim)               
                }

                if (par.x + canos.largura <= 0) {
                    canos.pares.shift();
                }
            })
        }
    }

    return canos
}

function criaChao() {
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        velocidade: 1,
        desenha() {
            contexto.drawImage(
                sprites,
                this.spriteX, this.spriteY,
                this.largura, this.altura,
                this.x, this.y,
                this.largura, this.altura
            )        
            contexto.drawImage(
                sprites,
                this.spriteX, this.spriteY,
                this.largura, this.altura,
                (this.x + this.largura), this.y,
                this.largura, this.altura
            )
        },
        atualiza() {
            let movimento = this.x - this.velocidade
            let repeteEm = this.largura / 2

            //console.log('[movimento]', movimento)
            //console.log('[repeteEm]', repeteEm)
            
            this.x = movimento % repeteEm

            //console.log('[chao.x]', this.x)
        }
    }

    return chao
}

function criaPersonagem() {
    const personagem = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        velocidade: 0,
        gravidade: 0.2,
        pulo: 4,
        movimentos: [
            { spriteX: 0, spriteY: 0 }, //asa para cima
            { spriteX: 0, spriteY: 26 }, //asa no meio
            { spriteX: 0, spriteY: 52 }, //asa pra baixo
            { spriteX: 0, spriteY: 26 }, //asa no meio
        ],
        frameAtual: 0,
        intervaloDeFramesMovimento: 10,
        atualizaFrameAtual(){
            if (frames % this.intervaloDeFramesMovimento === 0) {
                let baseRepeticao = this.movimentos.length
    
                //console.log('[frames]', frames)
                //console.log('[baseRepeticao]', baseRepeticao)
    
                this.frameAtual = frames % baseRepeticao
    
                //console.log('[personagem.frameAtual]', this.frameAtual)    
            }
        },
        pula() {
            //console.log('[pula]')            
            //console.log('[velocidade antes]', this.velocidade)

            somPulo.play()

            this.velocidade =- this.pulo

            //console.log('[velocidade depois]', this.velocidade)
        },
        fazColisao() {
            if (this.y + this.altura >= globais.chao.y) {
                return true;
            }
        
            if (this.y <= 0) {
                return true;
            }
        
            return false;
        },
        desenha() {
            this.atualizaFrameAtual()

            let { spriteX, spriteY }  = this.movimentos[this.frameAtual]

            contexto.drawImage(
                sprites,
                spriteX, spriteY,
                this.largura, this.altura,
                this.x, this.y,
                this.largura, this.altura
            )
        },
        atualiza() {
            if (this.fazColisao()) {
                //console.log('[colisão com chão ou teto]')

                somCaiu.play()
    
                mudaParaTela(telas.fim)
                
                return
            }
    
            this.velocidade += this.gravidade
            this.y += this.velocidade
        }
    }

    return personagem
}

function mudaParaTela(novaTela) {
    telaAtiva = novaTela

    if (telaAtiva.inicializa) {
        telaAtiva.inicializa()
    }
}

function repeticao() {
    telaAtiva.desenha()
    telaAtiva.atualiza()

    frames++

    requestAnimationFrame(repeticao)
}

window.addEventListener('click', function (){
    if (telaAtiva.click) {
        telaAtiva.click()
    }
})

mudaParaTela(telas.inicio)

repeticao()