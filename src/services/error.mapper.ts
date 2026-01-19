import { ERROR_MESSAGES } from '../config/constants';

export const mapHttpError = (status?: number): string => {
    switch (status) {
        case 400:
            return ERROR_MESSAGES.invalidCredentials;
        case 401:
            return ERROR_MESSAGES.unauthorized;
        case 404:
            return ERROR_MESSAGES.notFound;
        case 405:
            return 'Méthode non autorisée.';
        case 500:
        case 502:
        case 503:
            return ERROR_MESSAGES.serverError;
        default:
            return ERROR_MESSAGES.network;
    }
};
