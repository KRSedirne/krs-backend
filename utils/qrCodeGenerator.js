import QRCode from "qrcode";


export const generateQr = async (userId) => {
    try {
        const qrData = JSON.stringify({ userId });
        const qrCode = await QRCode.toDataURL(qrData, {
            errorCorrectionLevel: 'L',
            scale: 4,
            margin: 1
        });

        // Base64 string'i kısaltma (ilk 100 karakter)
        const shortenedQr = `${qrCode.slice(0, 100)}...`;
        
        return shortenedQr; 
    } catch (error) {
        throw new Error('QR code generation failed!');
    }
};



