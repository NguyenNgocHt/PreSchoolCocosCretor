import { v3 } from 'cc';
import { log } from 'cc';
import { tween } from 'cc';
import { _decorator, Component, Node, Vec3, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('drappable')
export class drappable extends Component {
    @property(Node)
    itemSelected: Node = null;
    private _startPosition: Vec3 = new Vec3(0, 0, 0);
    start() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
        this.node.on("return-prePosition", this.onReturnPrePosition.bind(this));
    }

    onTouchStart() {
        let p = this.node.getWorldPosition();
        this._startPosition = new Vec3(p.x, p.y, 0);
        this.node.emit('i-am-start');
    }

    onTouchMove(event: EventTouch){
        let p = event.getUILocation();
        this.node.setWorldPosition(p.x, p.y, 0);
        this.node.emit('i-am-moving', this.node);
    }
    onTouchEnd(){
        this.node.emit("i'm-end-moving");
        // this.node.setWorldPosition(this._startPosition.x, this._startPosition.y, 0);
    }
    onReturnPrePosition() {
        log("wrong!!!!!!");
        tween(this.node)
        .to(1, {worldPosition: v3(this._startPosition.x, this._startPosition.y, 0)})
        .start();
    }
    
    update(deltaTime: number) {
        
    }
}


