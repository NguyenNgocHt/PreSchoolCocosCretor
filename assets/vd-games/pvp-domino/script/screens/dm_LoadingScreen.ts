import { ProgressBar } from 'cc';
import { Label } from 'cc';
import { AudioClip, assetManager, Asset, Button, utils, sp, Prefab, tween, Vec3 } from 'cc';
import { sys } from 'cc';
import { _decorator, Component, log } from 'cc';
import { VDAudioManager } from '../../../../vd-framework/audio/VDAudioManager';
import VDLocalDataManager from '../../../../vd-framework/common/VDLocalDataManager';
import VDBasePopup from '../../../../vd-framework/ui/VDBasePopup';
import VDBaseScreen from '../../../../vd-framework/ui/VDBaseScreen';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import { dm_Config } from '../common/dm_Config';
import { dm_Director } from '../common/dm_Director';
import { dm_PlayScreen } from './dm_PlayScreen';
const { ccclass, property } = _decorator;

@ccclass('dm_LoadingScreen')
export class dm_LoadingScreen extends Component {

    @property(ProgressBar)
    loadingProgress: ProgressBar = null!;

    @property(Label)
    lbVersion: Label = null!;

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
            'res/prefabs/transition/transition_cloud',
            'res/prefabs/screen/play_screen',
            'res/prefabs/screen/play_screen_2',
            'res/prefabs/screen/play_screen_3',
        ];

        if (sys.isNative) this._items = this._items.concat(soundDirs);

        this._items = this._items
            // .concat(soundDirs)
            .concat(imageDirs)
            .concat(prefabDirs)
            .concat(prefabs);

        this._setVersion(dm_Config.versionGame);
    }

    start() {

        this.loadingProgress.progress = 0;

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
    }

    onClickBtn2MainGame() {
        log(`onClickBtn2MainGame`);

        let play_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/play_screen', Prefab)!;
        VDScreenManager.instance.replaceScreenAtIndex(play_screen, 0, (screen: VDBaseScreen) => {
            dm_Director.instance.playScreen = screen as dm_PlayScreen;
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

