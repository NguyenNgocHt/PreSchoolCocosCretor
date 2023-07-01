import { _decorator, Component, Node, Sprite, Color, log, Prefab, tween, v3, Label, Vec3, Button, UIOpacity, EventTouch, Graphics, v2, Vec2, AssetManager, resources, instantiate } from 'cc';
import VDBaseScreen from '../../../../../vd-framework/ui/VDBaseScreen';
import VDScreenManager from '../../../../../vd-framework/ui/VDScreenManager';
import { ScaleFactor, scaleTo, scaleTo2, TimeFactor } from '../../transiton/Transformation';

import { level_progress_bar } from '../../transiton/level_progress_bar';
import LocalDataManager from '../../common/LocalDataManager';
import { handleFirework } from '../../common/handleFirework';
import { scaleAndHide } from '../../transiton/Transformation';
import VDBasePopup from '../../../../../vd-framework/ui/VDBasePopup';
import { popup_next } from '../../popups/popup_next';
const { ccclass, property } = _decorator;

@ccclass('level2_science')
export class level2_science extends Component {
    @property(level_progress_bar)
    levelBarUI: level_progress_bar = null;
    @property(Node)
    levelNode: Node = null;
    @property({type: Node})
    area: Node = null;
    @property(Prefab)
    private gPrefab: Prefab = null;
    @property({type: Node})
    listLeft: Node[] = [];
    @property({type: Node})
    listRight: Node[] = [];
    @property({type: Node})
    fireWork: Node = null;

    private draw: Node = null;
    private listGraphics: Node[] = [];
    private count: number = 0;
    private graphics = null;
    private levelNumber = 1;
    private pStart = 0;
    private pEnd = 0;
    private idLeftSelected = null;
    private idRightSelected = null;
    

    start() {
        this.levelNumber = Number(this.levelNode.getComponent(Label).string);
        this.initGraphic();
    }
    initGraphic(){
        this.draw = instantiate(this.gPrefab);
        this.draw.on('draw-start', this.onTouchStart.bind(this));
        // this.draw.on('draw-move', this.onTouchMove.bind(this));
        // this.draw.on('draw-end', this.onTouchEnd.bind(this));
        this.area.addChild(this.draw);
        this.graphics = this.draw.getComponent(Graphics);
        let g = this.graphics;
        g.lineWidth=10;
        g.strokeColor = Color.BLACK;
        this.listGraphics.push(this.draw);
        log("check draw??", this.count++, this.draw);
        // log("check list init: ", this.listGraphics);
    }
    onTouchStart(startPosUI){
        log(startPosUI);
        let dx=0;
        let dy=0;
        let p;
        let minV = 1000000;
        let minResult = 1000000;
        for(let i=0; i<this.listLeft.length; i++){
            p = this.listLeft[i].getWorldPosition();
            dx = Math.abs(startPosUI.x-p.x);
            dy = Math.abs(startPosUI.y-p.y);
            minV = Math.abs(dx-dy);
            if(minV<minResult){
                this.idLeftSelected = i;
                minResult = minV;
            }
        }
        for(let i=0; i<this.listRight.length; i++){
            p = this.listRight[i].getWorldPosition();
            dx = Math.abs(startPosUI.x-p.x);
            dy = Math.abs(startPosUI.y - p.y);
            minV = Math.min(dx, dy);
            if(minV<minResult){
                this.idRightSelected = i;
                minResult = minV;
            }
        }
        log("check min: ", minV, this.idLeftSelected, this.idRightSelected);
        // let rootPos = this.listDots[this.id].getWorldPosition();
        // let dx = Math.abs(rootPos.x-startPosUI.x);
        // let dy = Math.abs(rootPos.y-startPosUI.y);
        // if(dx<40 && dy <40){
        //     this.firstCheck = true;
        //     this.listPointDraw.push(this.listDots[this.id]);
        // }
        // this.startPosUI = v2(startPosUI.x, startPosUI.y);
    }
    initTouchNode(){
        for(let i=0; i<this.listLeft.length; i++){
            this.listLeft[i].on(Node.EventType.TOUCH_START, this.initGraphic.bind(this));
            this.listLeft[i].on(Node.EventType.TOUCH_MOVE, this.onTouchMoveNode.bind(this));
            this.listLeft[i].on(Node.EventType.TOUCH_END, this.onTouchEndNode.bind(this));
        }
    }
    onTouchMoveNode(event: EventTouch){
        log("check>> ", event.getUILocation());
    }
    onTouchEndNode(){

    }
    drawMultiPoint(){
        // let g = this.graphics;
        // g.clear();
        // g.strokeColor = Color.RED;
        // let out = v3();
        // let p1 = this.listPointDraw[0].getWorldPosition();
        // this.area.inverseTransformPoint(out, v3(p1.x, p1.y, 0));
        // g.moveTo(out.x, out.y);
        // for(let i=1; i<this.listPointDraw.length; i++){
        //     p1 = this.listPointDraw[i].getWorldPosition();
        //     this.area.inverseTransformPoint(out, v3(p1.x, p1.y, 0));
        //     g.lineTo(out.x, out.y);
        // }
        // g.stroke();
    }
    

    // onTouchMove(movePosUI){
    //     if(this.firstCheck) {
    //         let targetPos = this.listDots[this.id+1].getWorldPosition();
    //         let dx = Math.abs(movePosUI.x - targetPos.x);
    //         let dy = Math.abs(movePosUI.y - targetPos.y);
    //         if(dx<20 && dy<20){
    //             this.listPointDraw.push(this.listDots[this.id+1]);
    //             this.id++;
    //         }
    //         if(this.id == this.listDots.length-1){
    //             this.onTouchEnd(movePosUI);
    //             this.handleNextScreen();
    //         }
    //     }
    // }
    
    // onTouchEnd(endPosUI){
    //     if(this.listPointDraw.length<2){
    //         this.clearCurrentDraw();
    //         return;
    //     }
    //     this.drawMultiPoint();
    //     this.initGraphic();
    //     this.firstCheck = false;
    // }
    
    handleNextScreen(){
        let ob = LocalDataManager.getObject("check", {});
        let checkDone = ob.science[this.levelNumber+1];
        if(this.levelBarUI){
            if(!checkDone) {
                this.levelBarUI.handleProgress();
            }
            ob.science[this.levelNumber+1] = true;
            LocalDataManager.setObject("check", ob);
        }
        this.fireWork.active = true;
        tween(this.fireWork)
        .to(3, {scale: v3(1, 1, 0)})
        .call(()=>{
            this.showPopupNext();
        })
        .call(()=>{
            this.fireWork.active = false;
        })
        .start();
    }
    
    showPopupNext(){
        VDScreenManager.instance.showPopupFromPrefabName("res/prefabs/popup/popup_next", (popup: VDBasePopup) => {
            let popupWin = popup as popup_next;
            // dinh nghia finshedCallBack chua goi nó
            popupWin.finishedCallback = () => {
                let level2_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/science/level'+String(this.levelNumber+ 1), Prefab)!;
                VDScreenManager.instance.pushScreen(level2_screen, (screen: VDBaseScreen) => { }, true); 
                log(' Just Closed Popup !!!');
            };
        }, false, true, true);
    }
    
    clearCurrentDraw(){
        let g = this.listGraphics.pop();
        g.getComponent(Graphics).clear();
        this.initGraphic();
    }
    backToMainScreen(){
        VDScreenManager.instance.popToRootScreen();
    }
    update(deltaTime: number) {
        
    }
}


