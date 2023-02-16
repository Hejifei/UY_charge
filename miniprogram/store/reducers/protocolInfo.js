import {
    SET_CHARGER_INFO,
    CLEAR_CHARGER_INFO,
} from '../constants/actionTypes'

const defaultState = {
    // chargerInfo: undefined,
    chargerInfo: {
        // batteryVoltage: 29,
        // chargeSwitch: "开",
        // chargerTemperature: 55,
        // chargingCapacity: 11.2,
        // chargingMode: "恒流模式",
        // chargingTime: 18,
        // chargingTiming: 120,
        // cutoffCurrent: 2.4,
        // dateOfManufacture: "2022/9/19",
        // fanLevel: "X5",
        // firmwareVersion: "1.0",
        // maximumCurrent: 30,
        // maximumVoltage: 29.4,
        // outputCurrent: 29.95,
        // outputVoltage: 28.62,
        // timingRemaining: 102,
    }
}

export const protocolInfo = (state = defaultState, action) => {
    switch (action.type) {
        case SET_CHARGER_INFO:
            return {
                ...state,
                chargerInfo: action.value,
            }
            case CLEAR_CHARGER_INFO:
                return {
                    ...state,
                    chargerInfo: undefined,
                }
            default:
                return state;
    }
}