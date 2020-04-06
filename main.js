(function(){
    function throttler(func,timeInterval){
        if(!this.func){ this.func = {}; }
        if(!this.func.throttleTimeout){
            this.func.throttleTimeout = setTimeout(function(){
                this.func.doneFuncForInterval = false;
                this.func.throttleTimeout = undefined;
            },timeInterval);
            if(this.func.doneFuncForInterval){ 
                return 
            }else{
                func();
                this.func.doneFuncForInterval = true;
            }
        }
    }
    function Bird(id){
        // internal values
        const 
            BIRD_CLASS      = 'bird',
            FLAPPING_CLASS  = 'flapWings',
            GOT_HIT         = 'gothit',
            FALLING_INTERVAL = 150,
            THROTTLE_DELAY = 250,
            TILT_PER_ITERATION    = 1,
            MAX_TILT_UP   = 45,
            MAX_TILT_DOWN = 90,
            GRAVITY  = 10,
            BOUNDARY = {},
            INITIAL_LEFT_POS = 0,
            INITIAL_TOP_POS  = 0,
            UP_MOVEMENT_PER_TAP = 50;
        
        const errorMsgs = {
            invalidNode : function(id) { return 'There is no valid node having id value '+id }
        }
        const init = function(id){
            const node = document.getElementById(id);
            if(node === undefined){
                throw new Error(errorMsgs.invalidNode);
            }
            this.node = node;
            this.node.classList.add(BIRD_CLASS);
            this.setBoundary(document.body);
        }
        const moveBirdUp = function(bird){
            const node = bird.node;
            const nodeRect = node.getBoundingClientRect();
            const newTopValue = nodeRect.top - UP_MOVEMENT_PER_TAP ;
            bird.fallingSpeed -= UP_MOVEMENT_PER_TAP;
            node.style.top = newTopValue + 'px';
            if(newTopValue <= BOUNDARY.top){
                bird.gotHit();
                debugger
            }else{
                bird.tiltUp();
            }
        }
        const fallDueToGravity = function(bird){
            const node = bird.node;
            const nodeRect = node.getBoundingClientRect();
            bird.fallingSpeed += GRAVITY;
            const newTopValue = nodeRect.top + bird.fallingSpeed;
            node.style.top = newTopValue + 'px';
            if(newTopValue >= (BOUNDARY.bottom - nodeRect.height)){
                bird.gotHit();
                debugger
            }else{
                bird.tiltDown();
            }
        }
        const gameOverFallDown = function(bird){
            console.log(bird);
        }
        
        // exposable values
        const variables = {
            didGetHit : false,
            fallingSpeed : 0,
            isFalling : false
        }
        const funcs = {
            startFlying : function(startingPosition){
                if(startingPosition){
                    this.node.style.left = (startingPosition.left || INITIAL_LEFT_POS )+'px';
                    this.node.style.top  = (startingPosition.top  || INITIAL_TOP_POS  )+'px';
                }
                this.node.classList.add(FLAPPING_CLASS);
                return this;
            },
            startFalling : function(){
                setInterval(function(){
                    fallDueToGravity(this)
                }.bind(this),FALLING_INTERVAL)
                this.isFalling = true;
            },
            stopFlying : function(){
                this.node.classList.remove(FLAPPING_CLASS);
                return this;
            },
            flyHigh : function(){
                if(!this.didGetHit){
                    moveBirdUp(this)
                }
                return this;
            },
            gotHit : function(){
                this.didGetHit = true;
                this.stopFlying();
                this.node.setAttribute(GOT_HIT,true);
                gameOverFallDown(this);
                return this;
            },
            tiltDown : function(){
                const node = this.node;
                // console.log('tiltDown');
                return this;
            },
            tiltUp : function(){
                const node = this.node;
                // console.log('tiltUp');
                return this;
            },
            setBoundary : function(node){
                const nodeRect = node.getBoundingClientRect();
                Object.assign(BOUNDARY,{
                    top     : nodeRect.top,
                    left    : nodeRect.left,
                    bottom  : nodeRect.bottom,
                    right   : nodeRect.right
                })
                return this;
            },
            addFlappingFunction : function(node){
                let prev = Date.now()
                node.addEventListener('keydown',function(){
                    throttler(function(event){
                        console.log(Date.now() - prev);
                        prev = Date.now();
                        if(event.code === "Space"){
                            if(!this.isFalling){
                                this.startFalling();
                            }else{
                                this.flyHigh();
                            }
                        }
                    }.bind(this,event),THROTTLE_DELAY)
                }.bind(this))
            }
        }
        Object.assign(this,funcs,variables);
        init.call(this,id);
        return this;
    }
    // main function
    document.addEventListener('DOMContentLoaded',function(){
        const bird = new Bird('flappyBird');
        const initialPos = {
            top : 350,
            left : 100
        }
        const background = this.getElementById('background');
        bird.startFlying(initialPos)
            .setBoundary(background)
            .addFlappingFunction(this.body);
    })
}())
