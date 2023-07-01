import { _decorator, Component, Node, Sprite, Color, log, Prefab, tween, v3, Label, Vec3, Button, UIOpacity, EventTouch, Graphics, v2, Vec2 } from 'cc';
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

@ccclass('level3_science')
export class level3_science extends Component {
    @property({type: Node})
    draw: Node = null;
    @property({type: Node})
    area: Node = null;
    @property({type: Node})
    listAnswers: Node[] = [];
    @property({type: Node})
    listQuestion: Node[] = [];
    @property({type: Node})
    fireWork: Node = null;

    @property({type: Node})
    left: Node = null;
    @property({type: Node})
    right: Node = null;

    @property(level_progress_bar)
    levelBarUI: level_progress_bar = null;
    @property(Node)
    level: Node = null;

    private graphics = null;
    private canPlay = true;
    public levelNumber = 1;
    private listPosSrc = [];
    private ListPosDestination = [];

    private pSrc: Vec2;
    private pTarget: Vec2;
    private pStart: Vec2;
    private pDrawStart: Vec2;
    private pTemp: Vec2;
    private currentStart: Vec2;
    private firstOne = true;
    private isStart = false;
    private idAnswer = null;
    private dem=0;

    start() {
        this.startPlay();
    }
    startPlay() { 
        if(this.canPlay){
            let lev = this.level.getComponent(Label).string;
            this.levelNumber = Number(lev);
            this.initGraphic();
           
            this.draw.on(Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
            this.draw.on(Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
            this.draw.on(Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
        }
    }
    initGraphic(){
        this.graphics = this.draw.getComponent(Graphics);
        this.graphics.lineWidth = 10;
    }
    onTouchStart(event: EventTouch){
        if(this.firstOne){
            // gan vi tri nguon
            for(let i=0; i<this.listAnswers.length; i++){
                let pLeft = this.listAnswers[i].getWorldPosition();
                this.listPosSrc[i] = v2(pLeft.x, pLeft.y);
            }
            // gan vi tri dich
            for(let i=0; i<this.listQuestion.length; i++){
                let pRight = this.listQuestion[i].getWorldPosition();
                this.ListPosDestination[i] = v2(pRight.x, pRight.y);
            }
            log("check first start: ", this.listPosSrc, this.ListPosDestination);
            this.firstOne = false;
        }else {
            if(this.pTemp != null){
                this.pStart = v2(this.pTemp.x, this.pTemp.y);
            }
            
        }
        // gan vi tri bat dau ve
        let p = event.getUILocation();
        this.pDrawStart = v2(p.x, p.y);
        
        // xu ly ve
        
        let out = v3();
        this.area.inverseTransformPoint(out, v3(p.x, p.y, 0));
        let g = this.graphics;
        g.strokeColor = Color.BLACK;
        g.moveTo(out.x, out.y);
    }
    checkStart(){
        for(let i=0; i<this.listPosSrc.length; i++){
            let dx = Math.abs(this.listPosSrc[i].x-this.pDrawStart.x);
            let dy = Math.abs(this.listPosSrc[i].y-this.pDrawStart.y);
            if(dx<50 && dy<50){
                log("check start: ", this.listPosSrc[i]);
                this.pStart = this.listPosSrc[i];
                this.idAnswer = i;
                this.isStart = true;
                break;
            }else {
                this.graphics.clear();
                // this.pTemp = this.listPosSrc[0];
                log("check start draw again!");
            }
        }
    }
    onTouchMove(event: EventTouch){
        let p = event.getUILocation();
        let out = v3();
        this.area.inverseTransformPoint(out, v3(p.x, p.y, 0));
        let g = this.graphics;
        g.lineTo(out.x, out.y);
        g.stroke();
    }
    onTouchEnd(event: EventTouch){
        // check xem no bat dau o cau tra loi nao
        if(!this.isStart){
            this.checkStart();
        }
        if(this.idAnswer != null){
            let p = event.getUILocation();
            log("check id answer: ", this.idAnswer);
            log("compare: ", this.pStart, this.pDrawStart);
            let dx = Math.abs(this.pStart.x-this.pDrawStart.x);
            let dy = Math.abs(this.pStart.y-this.pDrawStart.y);
            if(dx>40 || dy>40){
                log("draw again!")
                this.pTemp = v2(this.pStart.x, this.pStart.y);
                this.handleDrawAgain();
                
            }else {
                log("draw continue!");
                this.pTemp = v2(p.x, p.y);
                this.handleDrawContinue();
                //check answer before draw coninue;
                this.checkAnswer();
            }
        }
        
        
    }
    drawAgain(){
        this.graphics.clear();
        this.idAnswer = null;
    }
    handleDrawAgain(){

    }
    handleDrawContinue(){
        let g = this.graphics;
        //quy doi ve cung toa do
        let out1 = v3();
        this.area.inverseTransformPoint(out1, v3(this.pDrawStart.x, this.pDrawStart.y, 0));
        // di chuyen ve diem can ve
        g.moveTo(out1.x, out1.y);
        this.area.inverseTransformPoint(out1, v3(this.pStart.x, this.pStart.y, 0));
        // ve den diem can ve
        g.lineTo(out1.x, out1.y);
        g.stroke();
    }
    onClickInstruction() {
        // scaleTo(this.answer, ScaleFactor.BIG_BY_2, ScaleFactor.SMALL_BY_0_5, TimeFactor.MEDIUM, this.toDefault.bind(this));
    }
    onClickBack() {
        VDScreenManager.instance.popToRootScreen();
    } 
    checkAnswer(){
        if(this.canPlay){
            // check da noi dung cau tra loi chua
            let p = this.ListPosDestination[this.idAnswer];
            let dx = Math.abs(p.x - this.pTemp.x);
            let dy = Math.abs(p.y - this.pTemp.y);
            if(dx<40 && dy<40) {
                //dat lai trang thai de co chon cau de noi tiep
                this.isStart = false;
                
                // xu ly doi net ve thanh duong thang mau do
                let g = this.graphics;
                g.clear();
                g.strokeColor = Color.RED;
                let out = v3();
                let p1 = this.listPosSrc[this.idAnswer];
                this.area.inverseTransformPoint(out, v3(p1.x, p1.y, 0));
                g.moveTo(out.x, out.y);
                p1 = this.ListPosDestination[this.idAnswer];
                this.area.inverseTransformPoint(out, v3(p1.x, p1.y, 0));
                g.lineTo(out.x, out.y);
                g.stroke();
                //
                this.listPosSrc.splice(this.idAnswer,1);
                this.ListPosDestination.splice(this.idAnswer, 1);
                this.listAnswers[this.idAnswer].getComponent(Button).onDisable();
                log("correct!", this.listPosSrc);
                //
                this.processCorrect();
            }
        }
    }
    processCorrect(){
        this.idAnswer = null;
        this.dem++;
        log("check dem", this.dem);
        if(this.dem==this.listQuestion.length){

            this.canPlay = false;
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
        this.fireWork.active = true;
        tween(this.fireWork)
        .to(3, {scale: v3(1, 1, 0)})
        .call(()=>{
            this.fireWork.active = false;
        })
        .start();
        // this.smile.active = true;
        // this.smile.setScale( v3(0.1, 0.1, 0));
        // scaleAndHide(this.smile, v3(0.6, 0.6, 0), 2);
    }
    processWrong(){
        // this.cry.active = true;
        // tween(this.cry)
        // .to(1, {scale: v3(0.08, 0.08, 0)})
        // .to(0.2, {scale: v3(0, 0, 0)})
        // .start();
    }
    update(deltaTime: number) {
        
    }
    // active popup next
    showPopupNext() {
        log("check", this.levelNumber);
        VDScreenManager.instance.showPopupFromPrefabName("res/prefabs/popup/popup_next", (popup: VDBasePopup) => {
            let popupWin = popup as popup_next;
            // dinh nghia finshedCallBack chua goi nó
            popupWin.finishedCallback = () => {
                let level2_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/science/level'+String(this.levelNumber+1), Prefab)!;
                VDScreenManager.instance.pushScreen(level2_screen, (screen: VDBaseScreen) => { }, true); 
                log(' Just Closed Popup !!!');
            };
        }, false, true, true);
    }
}


