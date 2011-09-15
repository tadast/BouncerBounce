function playerInput(e) {
  e.preventDefault();
  var touches = e.changedTouches;
  if (touches !== undefined){
    var touch = touches[0];
    game.player.updatePosition(touch.clientX, touch.clientY);
  } else {
    game.player.updatePosition(e.x, e.y);
  };
};

var Bouncer = function(){
  this.scene = document.getElementById('scene');
  this.ctx = this.scene.getContext("2d");
  this.ball = new Ball();
  this.ball.init(this.ctx, this.scene.width, this.scene.height);

  this.goalKeeper = new Ball();
  this.goalKeeper.init(this.ctx, this.scene.width, this.scene.height);
  this.goalKeeper.setVelocity(1.5, 0);
  this.goalKeeper.setColor("#0e0");
  this.goalKeeper.moveTo(210, 30);

  this.player = new CBall();
  this.player.init(this.ctx, this.scene.width, this.scene.height);

  this.scene.addEventListener('mousemove', playerInput, false);
  this.scene.addEventListener('touchmove', playerInput, false);
  
  this.speed = 1000 / 60;
  
  var bouncer = this;
  return setInterval(function(){game.draw()}, this.speed);
  this.lastFrameAt = Date.now();
  this.compensator = 1.0;
};

Bouncer.prototype.constructor = Bouncer;

Bouncer.prototype.clearScene = function(){
  // only clear scene for controllable ball, others clear after themselves
  var fromY = this.scene.height - this.player.areaHeight() - this.player.r;
  this.ctx.clearRect(0, fromY, this.scene.width, this.scene.height);
};

Bouncer.prototype.draw = function(){
  Bouncer.prototype.calculateCompensator();
  this.processCollisions();
  this.clearScene();

  this.goalKeeper.applyVelocity(this.compensator);
  this.goalKeeper.draw();
  
  this.player.draw();
  
  this.ball.applyVelocity(this.compensator);
  this.ball.draw();
};

Bouncer.prototype.processCollisions = function(){
  if(this.ball.collidesWith(this.goalKeeper)){
    this.ball.onCollisionWith(this.goalKeeper);
  };
  if(this.ball.collidesWith(this.player)){
    this.ball.onCollisionWith(this.player);
  };
}

Bouncer.prototype.calculateCompensator = function(){
  var now = Date.now();
  game.compensator = ((now - game.lastFrameAt) / game.speed) || 1;
  game.lastFrameAt = now;
  return game.compensator;
}