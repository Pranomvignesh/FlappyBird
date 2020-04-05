(function(){
    function Bird(id){
        // internal values
        const 
            BIRD_CLASS      = 'bird',
            WING_ATTRIBUTE  = 'wings',
            FLAP_UP         = 'flapUp',
            FLAP_DOWN       = 'flapDown',
            GOT_HIT         = 'gothit',
            FLYING_STATE_INTERVAL = 200,
            TILT_PER_ITERATION    = 1,
            MAX_TILT_UP = 45,
            MAX_TILT_DOWN = 90,
            GRAVITY = 10,
            BOUNDARY = {},
            INITIAL_LEFT_POS = 0,
            INITIAL_TOP_POS  = 0,
            UP_MOVEMENT_PER_TAP = 60,
            DOWN_MOVEMENT_PER_ITERATION = 30;
        
        const initialState = FLAP_DOWN;
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
            this.changeWingState(this.currentWingState);
            this.setBoundary(document.body);
        }
        const moveBirdDown = function(bird){
            const node = bird.node;
            const nodeRect = node.getBoundingClientRect();
            const newTopValue = nodeRect.top + DOWN_MOVEMENT_PER_ITERATION;
            node.style.top = newTopValue + 'px';
            if(newTopValue >= (BOUNDARY.bottom - nodeRect.height)){
                bird.gotHit();
            }else{
                bird.tiltDown();
            }
        }
        const moveBirdUp = function(bird){
            const node = bird.node;
            const nodeRect = node.getBoundingClientRect();
            const newTopValue = nodeRect.top - UP_MOVEMENT_PER_TAP;
            node.style.top = newTopValue + 'px';
            if(newTopValue <= BOUNDARY.top){
                bird.gotHit();
            }else{
                bird.flap();
                bird.tiltUp();
            }
        }
        const fly = function(){
            if(this.currentWingState === FLAP_UP){
                this.changeWingState(FLAP_DOWN);
            }else if(this.currentWingState === FLAP_DOWN){
                this.changeWingState(FLAP_UP);
            }
            fallDueToGravity(this);
        }
        const fallDueToGravity = function(bird){
            const node = bird.node;
            const nodeRect = node.getBoundingClientRect();
            const newTopValue = nodeRect.top + DOWN_MOVEMENT_PER_ITERATION;
            node.style.top = newTopValue + 'px';
            if(newTopValue >= (BOUNDARY.bottom - nodeRect.height)){
                bird.gotHit();
            }else{
                bird.tiltDown();
            }
        }
        
        // exposable values
        const variables = {
            currentWingState : initialState,
            fly : fly.bind(this),
            didGetHit : false,
            fallingSpeed : 0
        }
        const funcs = {
            changeWingState : function(wingState){
                this.node.setAttribute(WING_ATTRIBUTE,wingState);
                this.currentWingState = wingState;
                return this;
            },
            startFlying : function(startingPosition){
                if(startingPosition){
                    this.node.style.left = (startingPosition.left || INITIAL_LEFT_POS )+'px';
                    this.node.style.top  = (startingPosition.top  || INITIAL_TOP_POS  )+'px';
                }
                this.flyingFunction = setInterval(this.fly,FLYING_STATE_INTERVAL)
                return this;
            },
            stopFlying : function(){
                clearInterval(this.flyingFunction);
                return this;
            },
            flyHigh : function(){
                if(!this.didGetHit){
                    moveBirdUp(this)
                }
                return this;
            },
            flap : function(){
                this.changeWingState(FLAP_UP);
                setTimeout(function(){
                    this.changeWingState(FLAP_DOWN);
                }.bind(this),FLYING_STATE_INTERVAL)
            },
            gotHit : function(){
                this.didGetHit = true;
                this.stopFlying();
                this.node.setAttribute(GOT_HIT,true);
                fallDown(this);
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
                node.addEventListener('keydown',function(){
                    if(event.code === "Space"){
                        this.flyHigh();
                    }
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
            top : 50,
            left : 100
        }
        const background = this.getElementById('background');
        bird.startFlying(initialPos)
            .setBoundary(background)
            .addFlappingFunction(this.body);
    })
}())
