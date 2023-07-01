import { _decorator, Component, Node, Prefab, instantiate, log, Gradient, Graphics, EventTouch, v3, Color, v2, tween, Label } from 'cc';
import VDBasePopup from '../../../../../vd-framework/ui/VDBasePopup';
import VDBaseScreen from '../../../../../vd-framework/ui/VDBaseScreen';
import VDScreenManager from '../../../../../vd-framework/ui/VDScreenManager';
import LocalDataManager from '../../common/LocalDataManager';
import { popup_next } from '../../popups/popup_next';
import { level_progress_bar } from '../../transiton/level_progress_bar';
const { ccclass, property } = _decorator;

@ccclass('level4_science')
export class level4_science extends Component {
    @property(level_progress_bar)
    levelBarUI: level_progress_bar = null;
    @property(Node)
    level: Node = null;
    @property(Prefab)
    gPrefab: Prefab = null;
    @property(Node)
    area: Node = null;
    @property(Node)
    listDots: Node[] = [];
    @property(Node)
    levelNode: Node = null;
    @property(Node)
    fireWork: Node = null;

    private draw: Node = null;
    private listGraphics: Node[] = [];
    private listPointDraw: Node[] = [];
    private graphics = null;
    private id: number = 0;
    private count =0;
    private levelNumber = 1;
    private firstCheck = false;
    private canPlay = true;

    start() {
        this.levelNumber = Number(this.levelNode.getComponent(Label).string);
        this.initGraphic();
        this.initDrawInstruction();
        this.initGraphic();
    }
    initGraphic(){
        this.draw = instantiate(this.gPrefab);
        this.draw.on('draw-start', this.onTouchStart.bind(this));
        this.draw.on('draw-move', this.onTouchMove.bind(this));
        this.draw.on('draw-end', this.onTouchEnd.bind(this));
        this.area.addChild(this.draw);
        this.graphics = this.draw.getComponent(Graphics);
        let g = this.graphics;
        g.lineWidth=10;
        g.strokeColor = Color.BLACK;
        this.listGraphics.push(this.draw);
        log("check draw??", this.count++, this.draw);
        // log("check list init: ", this.listGraphics);
    }
    initDrawInstruction(){
        // ve tu 1->9
        let p1 = this.listDots[0].getWorldPosition();
        let p2 = this.listDots[8].getWorldPosition();
        let out = v3();
        let g = this.graphics;
        g.strokeColor = Color.RED;
        this.area.inverseTransformPoint(out, v3(p1.x, p1.y, 0));
        g.moveTo(out.x, out.y);
        this.area.inverseTransformPoint(out, v3(p2.x, p2.y, 0));
        g.lineTo(out.x, out.y);
        g.stroke();
        // ve tu 2-> 10
        p1 = this.listDots[1].getWorldPosition();
        p2 = this.listDots[9].getWorldPosition();
        out = v3();
        this.area.inverseTransformPoint(out, v3(p1.x, p1.y, 0));
        g.moveTo(out.x, out.y);
        this.area.inverseTransformPoint(out, v3(p2.x, p2.y, 0));
        g.lineTo(out.x, out.y);
        g.stroke(); 
    }
    onTouchStart(startPosUI){
        let rootPos = this.listDots[this.id].getWorldPosition();
        let dx = Math.abs(rootPos.x-startPosUI.x);
        let dy = Math.abs(rootPos.y-startPosUI.y);
        if(dx<40 && dy <40){
            this.firstCheck = true;
            this.listPointDraw.push(this.listDots[this.id]);
        }
        // this.startPosUI = v2(startPosUI.x, startPosUI.y);
    }

    onTouchMove(movePosUI){
        if(this.firstCheck) {
            let targetPos = this.listDots[this.id+1].getWorldPosition();
            let dx = Math.abs(movePosUI.x - targetPos.x);
            let dy = Math.abs(movePosUI.y - targetPos.y);
            if(dx<20 && dy<20){
                this.listPointDraw.push(this.listDots[this.id+1]);
                this.id++;
            }
            if(this.id == this.listDots.length-1){
                this.onTouchEnd(movePosUI);
                this.handleNextScreen();
            }
        }
    }
    
    onTouchEnd(endPosUI){
        if(this.listPointDraw.length<2){
            this.clearCurrentDraw();
            return;
        }
        this.drawMultiPoint();
        this.initGraphic();
        this.firstCheck = false;
    }
    drawMultiPoint(){
        if(this.listPointDraw.length>=2) {
            let g = this.graphics;
            g.clear();
            g.strokeColor = Color.RED;
            let out = v3();
            let p1 = this.listPointDraw[0].getWorldPosition();
            this.area.inverseTransformPoint(out, v3(p1.x, p1.y, 0));
            g.moveTo(out.x, out.y);
            for(let i=1; i<this.listPointDraw.length; i++){
                p1 = this.listPointDraw[i].getWorldPosition();
                this.area.inverseTransformPoint(out, v3(p1.x, p1.y, 0));
                g.lineTo(out.x, out.y);
            }
            g.stroke();
        }
        this.listPointDraw = [];
    }
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


