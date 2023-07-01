import { VDGameConfig } from "../../../../vd-framework/common/VDGameConfig";

export type ex_ConfigType = VDGameConfig & {
    win_coin: number
};

export const ex_Config: ex_ConfigType = {
    GAME_ID: '1000',
    GAME_NAME: 'exam',
    versionGame: '1.0.0',
    isShowFPS: true,
    isUnitTest: true,
    //------ extends
    win_coin: 1000
};

