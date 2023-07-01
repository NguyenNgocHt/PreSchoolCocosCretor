import { _decorator, Component, Node, log, v3, tween, Sprite, Button, Vec2, Vec3, Label, Prefab } from 'cc';
import VDBasePopup from '../../../../../vd-framework/ui/VDBasePopup';
import VDBaseScreen from '../../../../../vd-framework/ui/VDBaseScreen';
import VDScreenManager from '../../../../../vd-framework/ui/VDScreenManager';
import LocalDataManager from '../../common/LocalDataManager';
import { popup_next } from '../../popups/popup_next';
import { level_progress_bar } from '../../transiton/level_progress_bar';
import { ScaleFactor, changePosition, scaleTo2, tweenSetColorAndToDefault } from '../../transiton/Transformation';
import { UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('level1_encode')
export class level1_encode extends Component {
    @property(Node)
    listSquares: Node[] = [];
    @property(Node)
    listRectangles: Node[] = [];
    @property(Node)
    listCircles: Node[] = [];
    @property(Node)
    listEncodeColors: Node[] = [];

    @property(level_progress_bar)
    levelBarUI: level_progress_bar = null;
    @property({type: Node})
    level: Node = null;
    @property({type: Node})
    fireWork: Node = null;
    @property(Node)
    iconSmile: Node = null;
    @property(Node)
    iconCry: Node = null;
    @property(Node)
    btnInstruction: Node = null;
    @property(Node)
    pointer: Node = null;
    

    private listAllFormColor = [];
    private listCount = [];
    private listCheckDone = [];
    private listCheckDone2 = [];
    private listCheckTargetColor = [];
    private idColor = 0;
    private preIdColor = 0;
    private levelNumber;
    private cnt = 0;
    private canPlay = true;
    start() {
        this.levelNumber = Number(this.level.getComponent(Label).string);
        this.initAllFormColor();
        this.initCount();
        this.initcheckDone();
        this.initOnTouchGetColor();
        this.getColor(0);
        this.initOnTouchDecode();
    }
    initAllFormColor(){
        this.listAllFormColor.push(this.listCircles);
        this.listAllFormColor.push(this.listSquares);
        this.listAllFormColor.push(this.listRectangles);
    }
    initCount(){
        for(let i=0; i<this.listAllFormColor.length; i++){
            this.listCount.push(0);
            this.listCheckTargetColor.push(i);
        }
    }
    initcheckDone(){
        for(let i=0; i<this.listAllFormColor.length; i++){
            this.listCheckDone.push([]);
            this.listCheckDone2.push([]);
            for(let j=0; j<this.listAllFormColor[i].length; j++){
                this.listCheckDone[i].push(false);
                this.listCheckDone2[i].push(j);
            }
        }
    }
    initOnTouchGetColor(){
        for(let i=0; i<this.listEncodeColors.length; i++){
            this.listEncodeColors[i].on(Node.EventType.TOUCH_START, this.getColor.bind(this, i));
        }
    }
    getColor(i: number){
        if(this.preIdColor!=null){
            scaleTo2(this.listEncodeColors[this.preIdColor], ScaleFactor.EQUAL, 0.001);
        }
        scaleTo2(this.listEncodeColors[i], ScaleFactor.BIG_BY_1_5, 0.001);
        this.idColor = i;
        this.preIdColor = i;
    }
    initOnTouchDecode(){
        for(let i=0; i<this.listEncodeColors.length; i++){
            for(let j=0; j<this.listAllFormColor[i].length; j++){
                this.listAllFormColor[i][j].on(Node.EventType.TOUCH_START, this.checkColor.bind(this, i, j));
            }
        }
    }
    
    selectColor(i: number){
        scaleTo2(this.listEncodeColors[i], ScaleFactor.BIG_BY_1_5, 1);
    }
    unSelectColor(i: number){
        scaleTo2(this.listEncodeColors[i], ScaleFactor.EQUAL, 1);
    }
    checkColor(i: number, j:number){
        if(i==this.idColor){
            if(!this.listCheckDone[i][j]){
                let color = this.listEncodeColors[i].getComponent(Sprite).color;
                this.listAllFormColor[i][j].getComponent(Sprite).color = color;
                this.listCount[i]++;
                this.listCheckDone[i][j] = true;
                
                this.listCheckDone2[i].splice(this.listCheckDone2[i].indexOf(j), 1);
                if(this.listCount[i]==this.listAllFormColor[i].length){ 
                    this.scaleAndHide(this.listEncodeColors[i], v3(1, 1, 1));
                    this.cnt++;
                    if(this.listEncodeColors.length===this.cnt){
                        this.handlePlusExperienceAndActiveFireWork();
                        this.handleShowPopupNext();
                    }
                    this.listCheckTargetColor.splice(this.listCheckTargetColor.indexOf(i), 1);
                }
            }
        }else{
            this.iconCry.active = true;
            this.scaleAndHide(this.iconCry, v3(0.06, 0.06, 0.06));
        }
    }
    handlePlusExperienceAndActiveFireWork(){
        let obCheck = LocalDataManager.getObject("check", {});
        let currentLevel = obCheck.encode[this.levelNumber+1];
        if(!currentLevel) {
          this.levelBarUI.handleProgress();
        }
        obCheck.encode[this.levelNumber+1] = true;
        LocalDataManager.setObject("check", obCheck);
        this.scaleAndHide(this.fireWork, v3(1,1,1));
    }
    
    scaleAndHide(nodeFactor: Node, scaleFactor: Vec3, callback?:Function){
        nodeFactor.setScale(v3(0, 0, 0));
        nodeFactor.active = true;
        tween(nodeFactor)
        .to(2, {scale: scaleFactor})
        .call(()=>{
            nodeFactor.active = false;
        })
        .call(callback)
        .start();
    }
    handleShowPopupNext(){
        log("check level", this.levelNumber);
        VDScreenManager.instance.showPopupFromPrefabName("res/prefabs/popup/popup_next", (popup: VDBasePopup) => {
            let popupWin = popup as popup_next;
            // dinh nghia finshedCallBack chua goi nó
            popupWin.finishedCallback = () => {
                let levelNext_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/encode/level'+String(this.levelNumber+1), Prefab)!;
                VDScreenManager.instance.pushScreen(levelNext_screen, (screen: VDBaseScreen) => { }, true); 
            };
        }, false, true, true);
    }
    backToMainScreen(){
        VDScreenManager.instance.popToRootScreen();
    }
    onInstruction(){
        if(this.canPlay){
            this.canPlay = false;
            this.btnInstruction.getComponent(Button).onDisable();
            this.btnInstruction.getComponent(UIOpacity).opacity = 100;
        }else{
            return;
        }
        // log("check: ", this.listCheckDone2, this.listCheckTargetColor);
        let len = this.listCheckTargetColor.length;
        let idRandom = Math.floor(Math.random()*len);
        let id = this.listCheckTargetColor[idRandom];
        let color = this.listEncodeColors[id].getComponent(Sprite).color;

        len = this.listCheckDone2[id].length;
        let idRandom2 = Math.floor(Math.random()*len);
        let id2 = this.listCheckDone2[id][idRandom2];

        // this.listAllFormColor[id][id2].getComponent(Sprite).color = color;
        // tweenSetColorAndToDefault(this.listEncodeColors[id], this.listAllFormColor[id][id2],2);
        tween(this.node)
        .call(()=>{
            log("check id: ", id, id2);
            this.pointer.active = true;
            let p = this.listEncodeColors[id].getWorldPosition();
            this.pointer.setWorldPosition(v3(p.x, p.y, 0));
            this.selectColor(id);
        })
        .delay(2)
        .call(()=>{
            let p = this.listAllFormColor[id][id2].getWorldPosition();
            this.pointer.setWorldPosition(v3(p.x, p.y, 0));
            // changePosition(this.pointer, v3(p.x, p.y, 0), 2);
            tweenSetColorAndToDefault(this.listEncodeColors[id], this.listAllFormColor[id][id2],2);
        })
        .delay(2)
        .call(()=>{
            this.pointer.active = false;
            this.unSelectColor(id);
            this.canPlay = true;
            this.btnInstruction.getComponent(Button).onEnable();
            this.btnInstruction.getComponent(UIOpacity).opacity = 255;
        })
        .start();
    }
    update(deltaTime: number) {
        
    }
}


