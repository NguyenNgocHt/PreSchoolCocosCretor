import { _decorator, Component, Node, tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('handleFirework')
export class handleFirework extends Component {
    @property(Node)
    fireworkNode: Node = null;
    startPlay(){
        this.fireworkNode.active = true;
        tween(this.fireworkNode)
        .to(3, {scale: v3(1.5, 1.5, 0)})
        .call(this.startEnd)
        .start()
    }
    startEnd(){
        this.fireworkNode.active = false;
    }
    start() {

    }

    update(deltaTime: number) {
        
    }
}


