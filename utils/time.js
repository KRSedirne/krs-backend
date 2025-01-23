import moment from 'moment';
import '../node_modules/moment/locale/tr.js';
import ErrorHandler from './errorHandler.js';

export const convertTime = (date, locale, format) => {
    try {

        const setDate = date.toDateString() + " " + date.toLocaleTimeString();

        return moment(setDate).locale(locale).format(format);

    } catch (error) {
        throw new ErrorHandler("Date is not valid", 400);
    }
}