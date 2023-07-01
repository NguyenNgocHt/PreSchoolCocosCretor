import { _decorator, Component, Node, ProgressBar, Label, sys, log, assetManager, AudioClip, Asset, Prefab } from 'cc';
import { VDAudioManager } from '../../../../vd-framework/audio/VDAudioManager';
import VDLocalDataManager from '../../../../vd-framework/common/VDLocalDataManager';
import VDBasePopup from '../../../../vd-framework/ui/VDBasePopup';
import VDBaseScreen from '../../../../vd-framework/ui/VDBaseScreen';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import { ex_Config } from '../common/ex_Config';
import { ex_Director } from '../common/ex_Director';
import LocalDataManager from '../common/LocalDataManager';
import { ex_MainScreen } from './ex_MainScreen';
import { ex_MatchScreen } from './ex_MatchScreen';


const { ccclass, property } = _decorator;

@ccclass('ex_LoadingScreen2')
export class ex_LoadingScreen2 extends Component {
    @property(ProgressBar)
    loadingProgress: ProgressBar = null!;
    @property(Label)
    lbVersion: Label = null!;
    @property(Node)
    startBtn: Node = null!;

   

    private _audios: { [key: string]: string } = {};
    private _items: string[] = [];

    onLoad() {
        let soundDirs = [
            'res/sounds/bgm/',
            'res/sounds/sfx/',
        ];

        let imageDirs = [
            'res/fonts/',
            'res/images/bgr/',
        ];

        let prefabDirs = [
            'res/anims/prefabs/',
            'res/prefabs/popup/',
        ];

        let prefabs = [
            'res/prefabs/common/draw',

            'res/prefabs/screen/main_screen',
            'res/prefabs/screen/match_screen',
            'res/prefabs/screen/match/level1',
            'res/prefabs/screen/match/level2',
            'res/prefabs/screen/match/level3',

            'res/prefabs/screen/comparison_screen',
            'res/prefabs/screen/comparison/level1',
            'res/prefabs/screen/comparison/level2',
            'res/prefabs/screen/comparison/level3',
            'res/prefabs/screen/comparison/level4',
            'res/prefabs/screen/comparison/level5',

            'res/prefabs/screen/picture_screen',
            'res/prefabs/screen/complete_picture/level1',
            'res/prefabs/screen/complete_picture/level2',
            // 'res/prefabs/screen/complete_picture/level3',

            'res/prefabs/screen/logic_screen',
            // 'res/prefabs/screen/complete_picture/level1',
            // 'res/prefabs/screen/complete_picture/level2',

            'res/prefabs/screen/draw_screen',

            'res/prefabs/screen/science_screen',
            'res/prefabs/screen/science/level1',
            'res/prefabs/screen/science/level2',
            'res/prefabs/screen/science/level3',
            'res/prefabs/screen/science/level4',

            'res/prefabs/screen/recognize_screen',
            // 'res/prefabs/screen/recognize/level1',
            // 'res/prefabs/screen/recognize/level2',
            // 'res/prefabs/screen/recognize/level3',
            // 'res/prefabs/screen/recognize/level4',

            'res/prefabs/screen/language_screen',

            'res/prefabs/screen/encode_screen',
            'res/prefabs/screen/encode/level1',
            'res/prefabs/screen/encode/level2',
        ];

        if (sys.isNative) this._items = this._items.concat(soundDirs);

        this._items = this._items
            // .concat(soundDirs)
            .concat(imageDirs)
            .concat(prefabDirs)
            .concat(prefabs);

        this._setVersion(ex_Config.versionGame);
    }

    start() {
        
        
        this.initCheck();
        this.loadingProgress.progress = 0;
        this.startBtn.active = false;
        let percent = 1.0 / (this._items.length + 1);
        sys.isBrowser && this._loadAudioWeb();
        VDScreenManager.instance.assetBundle.load('res/prefabs/popup/popup_notify',
            (err, data) => {
                if (!err) {
                    this._loadAsset(0, percent);
                }
                else {
                    log("load error  " + err + " _loadAsset");
                    if (sys.isBrowser) {
                        alert("Không có kết nối, vui lòng thử lại");
                    }
                }
            });
    }

    initCheck(){
        let ob = LocalDataManager.getObject("check", {});
        if(Object.keys(ob).length===0){
            LocalDataManager.setObject("check", {
                "comparison":[false, true, false, false, false],
                "match":[false, true, false, false,false],
                "picture":[false, true, false, false,false, false],
                "science":[false, true, false, false,false, false],
                "encode":[false, true, false, false,false, false, false, false],
            })
        }
        
        
        
        log(">>", LocalDataManager.getObject("check", {}))
    }

    private _loadAudioWeb() {
        let soundDirs = [
            'res/sounds/bgm/',
            'res/sounds/sfx/',
        ];
        soundDirs.forEach(soundsPath => {
            const sounds = VDScreenManager.instance.assetBundle.getDirWithPath(soundsPath, AudioClip);
            sounds.forEach(sound => {
                if (this._audios[`${sound.path}`]) return;
                const nativeUrl = assetManager.utils.getUrlWithUuid(sound.uuid, { isNative: true, nativeExt: '.mp3' });
                // log('sound', sound.path, sound.uuid, nativeUrl);
                // log('sound', assetManager.utils.getUrlWithUuid(sound.uuid, { isNative: false }))
                this._audios[`${sound.path}`] = nativeUrl;
            })
        });

        this._initAudio();
    }

    private _initAudio() {
        VDAudioManager.instance.init(this._audios);

        let isMuteMusic = VDLocalDataManager.getBoolean(VDAudioManager.ENABLE_MUSIC, false);
        let isMuteSfx = VDLocalDataManager.getBoolean(VDAudioManager.ENABLE_SFX, false);

        VDAudioManager.instance.isMutingMusic = isMuteMusic;
        VDAudioManager.instance.isMutingEffect = isMuteSfx;
    }

    private _loadAsset(index: number, totalPercent: number) {
        if (index >= this._items.length) {
            this.loadingProgress.progress = 1.0;
            this._finishedLoading();
            return;
        }
        let path = this._items[index];
        log("_loadAsset  " + path);
        if (this._isDirectory(path)) {
            VDScreenManager.instance.assetBundle.loadDir(path,
                (finished, total) => {
                    // log(`items #${index}:  ${finished} / ${total} `);
                    let progress = index * totalPercent + finished / total * totalPercent;
                    if (progress > this.loadingProgress.progress) {
                        this.loadingProgress.progress = progress;
                    }
                },
                (err, data) => {
                    if (sys.isNative && (path.endsWith('/bgm/') || path.endsWith('/sfx/'))) {
                        // log(`AudioClip loaded:${JSON.stringify(this._audios)}`);
                        let assets: Asset[] = data;
                        for (let as of assets) {
                            if (as instanceof AudioClip) {
                                this._audios[`${path}${as.name}`] = `${as._nativeAsset.url}`;
                            }
                        }

                        this._initAudio();
                    }

                    if (!err) {
                        this.scheduleOnce(() => {
                            this._loadAsset(index + 1, totalPercent);
                        }, 0);
                    } else {
                        log("load error  " + err + "    " + path);
                        if (sys.isBrowser) {
                            this.showPopupMessage("Đã có lỗi tải tài nguyên, vui lòng thử lại");
                        }
                    }
                });
        }
        else {
            VDScreenManager.instance.assetBundle.load(path,
                (finished, total) => {
                    // log(`${finished} / ${total} `);
                    this.loadingProgress.progress = index * totalPercent + finished / total * totalPercent;
                },
                (err, data) => {
                    if (!err) {
                        this.scheduleOnce(() => {
                            this._loadAsset(index + 1, totalPercent);
                        }, 0);
                    }
                    else {
                        log("load error  " + err + "    " + path);
                        if (sys.isBrowser) {
                            this.showPopupMessage("Đã có lỗi tải tài nguyên, vui lòng thử lại");
                        }
                    }
                });
        }
    }

    private _finishedLoading() {
        log(`LoadingScreen: _finishedLoading`);
        this.startBtn.active = true;
        this.startBtn.on(Node.EventType.TOUCH_END, this.onClickBtn2MainGame.bind(this));
    }

    onClickBtn2MainGame() {
        log(`onClickBtn2MainGame`);
        
        let play_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/main_screen', Prefab)!;
        VDScreenManager.instance.replaceScreenAtIndex(play_screen, 0, (screen: VDBaseScreen) => {
            // ex_Director.instance.playScreen = screen as ex_MainScreen;
        });

    }

    private showPopupMessage(message: string) {
        VDScreenManager.instance.showPopupFromPrefabName("res/prefabs/popup/popup_notify", (popup: VDBasePopup) => {
            // let popupDisplay = popup as DomiPopupNotify;
            // popupDisplay.setupPopup(message, [
            //     () => {
            //         VDScreenManager.instance.hidePopup(true);
            //         let percent = 1.0 / (this._items.length + 1);
            //         this._loadAsset(0, percent);
            //     },
            //     () => {
            //         VDScreenManager.instance.hidePopup(true);
            //     }
            // ]);
        }, true, true, false);
    }

    private _setVersion(version: string) {
        this.lbVersion && (this.lbVersion.string = 'v' + version);
    }

    private _isDirectory(path: string | null): boolean {
        return path != null && typeof path == 'string' && path.length > 0 && path[path.length - 1] == '/';
    }
}


