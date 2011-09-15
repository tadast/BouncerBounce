var Ball = function(){};

Ball.prototype.constructor = Ball;

Ball.prototype.init = function(ctx, width, height) {
  this.ctx = ctx;
  this.x = width/2;
  this.y = height/2;
  this.setVelocity(0.0, 1.0);
  this.r = 30;
  this.width = width;
  this.height = height;
  this.bgColor = "#333";
  this.setColor("#e00");
};

Ball.prototype.draw = function(){
  this.ctx.fillStyle = this.color;
  this.ctx.beginPath();
  this.ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
  this.ctx.closePath();
  this.ctx.fill();
};

Ball.prototype.clearOld = function(){
  this.ctx.fillStyle = this.bgColor;
  this.ctx.beginPath();
  this.ctx.arc(this.x, this.y, this.r + 1, 0, Math.PI*2, true);
  this.ctx.closePath();
  this.ctx.fill();
};

Ball.prototype.applyVelocity = function(compensator){
  this.clearOld();
  this.bounceBoundaries();
  this.x += this.xv * 6 * compensator;
  this.y += this.yv * 6 * compensator;
  this.applyLimits();
};

Ball.prototype.moveTo = function(x, y){
  this.x = x;
  this.y = y;
};

Ball.prototype.collidesWith = function(ballBro){
  var radiuses = this.r + ballBro.r;
  var deltaX = this.x - ballBro.x;
  var deltaY = this.y - ballBro.y;
  var distanceSq = deltaX * deltaX + deltaY * deltaY;
  if (distanceSq <= radiuses * radiuses){
    return true;
  } else {
    return false;
  };
}

Ball.prototype.bounceBoundaries = function(){
  if (this.x + this.xv + this.r > this.width || this.x - this.r + this.xv < 0)
    this.xv = -this.xv;
  if (this.y + this.yv + this.r > this.height || this.y - this.r + this.yv < 0)
    this.yv = - this.yv;
}

Ball.prototype.setVelocity = function(xv, yv){
  this.xv = xv;
  this.yv = yv;
};

Ball.prototype.setColor = function(color){
  this.color = color;
}

Ball.prototype.onCollisionWith = function(ball){
  var length = (ball.r + this.r)/-2.0;
  var bounceXV = (ball.x - this.x) / length;
  var bounceYV = (ball.y - this.y) / length;

  this.xv += bounceXV;
  this.yv += bounceYV;
  //normalize
  length = Math.sqrt(this.xv * this.xv + this.yv * this.yv);
  this.xv = this.xv / length;
  this.yv = this.yv / length;
};

Ball.prototype.applyLimits = function(){
  if(this.x < this.r){
    this.x = this.r;
  }else if(this.x > this.sceneWidth - this.r){
    this.x = this.sceneWidth - this.r;
  };
  
  if(this.y > this.sceneHeight - this.r){
    this.y = this.sceneHeight - this.r;
  }else if(this.y < this.r){
    this.y = this.r;
  };
};