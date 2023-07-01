import { _decorator, Component, Node, Vec3, Graphics, UITransform, EventTouch, Vec2, math, v3, Color } from 'cc';
const { ccclass, property } = _decorator;

const temp_vec2 = new Vec2();

@ccclass('graphic_filling')
export class graphic_filling extends Component {
    area: Node = null;
    graphics: Graphics = null!;

    start() {
        this.initGraphics();
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    }
    initGraphics(){
        let parentG = this.node.getParent();
        this.area = parentG?parentG:null;
        this.graphics = this.node.getComponent(Graphics);
    }

    onTouchStart(event: EventTouch) {
        let p = event.getUILocation();
        let out = v3();
        this.area.inverseTransformPoint(out, v3(p.x, p.y, 0));
        let g = this.graphics;
        g.moveTo(out.x, out.y);
        g.stroke();
        this.node.emit('draw-start', p);
    }

    onTouchMove(event: EventTouch) {
        let newP = event.getUILocation();
        let out = v3();
        this.area.inverseTransformPoint(out, v3(newP.x, newP.y, 0));
        let g = this.graphics;
        g.lineTo(out.x, out.y);
        g.stroke();
        this.node.emit('draw-move', newP);
    }
    onTouchEnd(event: EventTouch){
        let pEnd = event.getUILocation();
        this.node.emit('draw-end', pEnd);
    }
    clear(){
        this.graphics.clear();
    }
}


