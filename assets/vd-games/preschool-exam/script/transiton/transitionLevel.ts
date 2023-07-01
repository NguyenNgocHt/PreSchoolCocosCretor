import { _decorator, Component, Node } from 'cc';
import { changePosition, ScaleFactor, scaleTo2 } from './Transformation';
import { Button } from 'cc';
import { UIOpacity } from 'cc';
import { v3 } from 'cc';
import { log } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('transitionLevel')
export class transitionLevel extends Component {
    @property(Node)
    listLevel: Node[] = [];
    @property(Node)
    listPositon: Node[] = [];
    @property(Node)
    btnNext: Node = null;
    @property(Node)
    btnBack: Node = null;

    private idLevelCurrent = 0;
    start() {
        let p = this.listPositon[2].getWorldPosition();
        this.listLevel[this.idLevelCurrent+1].setWorldPosition(v3(p.x, p.y, 0));
        scaleTo2(this.listLevel[this.idLevelCurrent+1], ScaleFactor.BIG_BY_1_2, 0.1);
    }
    onClickNext(){
        for(let i=0; i<this.listPositon.length-1; i++){
            let pDes = this.listPositon[i].getWorldPosition();
            changePosition(this.listLevel[this.idLevelCurrent+i], pDes, 0.3);
        }
        this.idLevelCurrent++;
        scaleTo2(this.listLevel[this.idLevelCurrent], ScaleFactor.EQUAL, 0.1);
        scaleTo2(this.listLevel[this.idLevelCurrent+1], ScaleFactor.BIG_BY_1_2, 0.1);
    }
    onClickBack(){
        for(let i=1; i<this.listPositon.length; i++){
            let pDes = this.listPositon[i].getWorldPosition();
            changePosition(this.listLevel[this.idLevelCurrent-1+i-1], pDes, 0.3);
        }
        scaleTo2(this.listLevel[this.idLevelCurrent], ScaleFactor.BIG_BY_1_2, 0.1);
        scaleTo2(this.listLevel[this.idLevelCurrent+1], ScaleFactor.EQUAL, 0.1);
        this.idLevelCurrent--;
    }
    onDisablBtn(node: Node){
        node.getComponent(Button).onDisable();
        node.getComponent(UIOpacity).opacity = 100;
    }
    onEnableBtn(node: Node){
        node.getComponent(Button).onEnable();
        node.getComponent(UIOpacity).opacity = 255;
    }
    handleEnAndDisBtn(){
        if(this.idLevelCurrent!=this.listLevel.length-3){
            this.onEnableBtn(this.btnNext);
        }else{
            this.onDisablBtn(this.btnNext);
        }

        if(this.idLevelCurrent!=0) {
            this.onEnableBtn(this.btnBack);
        }else {
            this.onDisablBtn(this.btnBack);
        }
    }
    update(deltaTime: number) {
        this.handleEnAndDisBtn();
    }

}


